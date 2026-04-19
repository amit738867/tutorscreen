"use server";

import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";

export async function getInterviewsByUserId(userId: string): Promise<Interview[] | null> {
    if (!userId) return [];
    
    try {
        const interviewsQuery = await db
          .collection('interviews')
          .where('userId', '==', userId)
          .orderBy('createdAt', 'desc')
          .get();

        const interviews = interviewsQuery.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Interview[];

        // Efficiently fetch feedback for each interview
        const interviewsWithFeedback = await Promise.all(interviews.map(async (interview) => {
            const feedbackQuery = await db.collection('feedback')
                .where('interviewId', '==', interview.id)
                .limit(1)
                .get();
            
            const feedback = feedbackQuery.empty ? null : feedbackQuery.docs[0].data();
            return { ...interview, feedback };
        }));

        return interviewsWithFeedback;
    } catch (e) {
        console.error("Error fetching interviews with feedback:", e);
        return [];
    }
}

export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] | null> {
    const { userId, limit = 20 } = params;

    try {
        const query = db
          .collection('interviews')
          .orderBy('createdAt', 'desc')
          .where('finalized', '==', true);
          
        const finalQuery = userId 
          ? query.where('userId', '!=', userId)
          : query;
          
        const interviews = await finalQuery.limit(limit).get();

        return interviews.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        })) as Interview[];
    } catch (e) {
        console.error("Error in getLatestInterviews:", e);
        return [];
    }
}

import { staticTracks } from "@/constants/tracks";

export async function getInterviewsById(id: string): Promise<Interview | null> {
    try {
        // Check static tracks first if it matches pattern
        if (id.startsWith("tech-") || id.startsWith("edu-") || id.startsWith("fin-") || id.startsWith("mkt-") || id.startsWith("ext-")) {
            const staticTrack = staticTracks.find(t => t.id === id);
            if (staticTrack) return staticTrack as any;
        }

        const interview = await db.collection('interviews').doc(id).get();
        if (!interview.exists) return null;
        return { id: interview.id, ...interview.data() } as Interview;
    } catch (e) {
        return null;
    }
}

export async function createInterview(params: any) {
    try {
        const docRef = await db.collection("interviews").add({
            ...params,
            finalized: false,
            createdAt: new Date().toISOString(),
        });
        return { success: true, id: docRef.id };
    } catch (e) {
        console.error("Error creating interview:", e);
        return { success: false };
    }
}

export async function finalizeInterview(id: string) {
    try {
        await db.collection("interviews").doc(id).update({
            finalized: true
        });
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}

export async function updateUserPreferences(userId: string, prefs: any) {
    if (!userId) return { success: false };
    try {
        await db.collection('users').doc(userId).update(prefs);
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}

export async function clearUserHistory(userId: string) {
    if (!userId) return { success: false };
    try {
        const interviews = await db.collection('interviews').where('userId', '==', userId).get();
        const feedback = await db.collection('feedback').where('userId', '==', userId).get();

        const batch = db.batch();
        interviews.docs.forEach(doc => batch.delete(doc.ref));
        feedback.docs.forEach(doc => batch.delete(doc.ref));

        await batch.commit();
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}

export async function getUserFeedback(userId: string): Promise<any[]> {
    if (!userId) return [];
    try {
        const feedback = await db.collection('feedback')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();

        return feedback.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (e) {
        console.error("Error fetching user feedback:", e);
        return [];
    }
}

import { revalidatePath } from "next/cache";

export async function createFeedback(params: CreateFeedbackParams) {
    const { interviewId, userId, transcript, feedbackId } = params;

    try{
        if (transcript.length < 3) {
            const baselineFeedback = {
                interviewId,
                userId,
                totalScore: 0,
                clarity: { score: 0, explanation: "Session too short for analysis." },
                simplicity: { score: 0, explanation: "Session too short for analysis." },
                patience: { score: 0, explanation: "Session too short for analysis." },
                fluency: { score: 0, explanation: "Session too short for analysis." },
                warmth: { score: 0, explanation: "Session too short for analysis." },
                finalVerdict: "Rejected",
                summary: "This session was terminated before enough data could be gathered for a pedagogical analysis.",
                evidence: "No significant evidence captured due to early termination.",
                createdAt: new Date().toISOString(),
            };
            const fbRef = db.collection("feedback").doc();
            await fbRef.set(baselineFeedback);
            revalidatePath(`/interview/${interviewId}/feedback`);
            revalidatePath(`/analytics`);
            revalidatePath(`/`);
            return { success: true, feedbackId: fbRef.id };
        }

        const formattedTranscript = transcript.map((sentence: { role: string; content: string; }) => (
            `- ${sentence.role}: ${sentence.content}\n`
        )).join("");

        const { object } = await generateObject({
          model: google("gemini-2.0-flash-001"),
          schema: feedbackSchema,
          prompt: `
            You are a professional Executive Recruiter and Interview Coach analyzing a high-stakes mock interview transcript.
            Your task is to provide a surgical, recruiter-ready evaluation of the candidate's performance.
            
            Transcript:
            ${formattedTranscript}
    
            CRITERIA FOR EVALUATION:
            - **Clarity**: Was the candidate easy to understand? Did they avoid jargon where unnecessary?
            - **Simplicity**: Did they explain complex concepts in a way that anyone could understand?
            - **Patience**: Did they maintain a helpful and supportive tone throughout?
            - **Fluency**: Did the conversation flow naturally without long pauses or stuttering?
            - **Warmth**: Did the candidate project an approachable and professional persona?

            OUTPUT REQUIREMENTS:
            1. **Total Score**: A weighted average (0-100) based on overall performance.
            2. **Final Verdict**: Either "Selected" or "Rejected" based on whether they met the bar for an Elite protocol.
            3. **Summary**: A concise paragraph summarizing their performance.
            4. **Evidence**: 2-3 direct, highlighted quotes from the candidate that serve as evidence for your score (e.g., "The candidate said: '...' which demonstrated great clarity").
            `,
          system:
            "You are a professional Executive Recruiter. Your analysis must be objective, evidence-based, and formatted for a clean recruiter-friendly dashboard.",
        });

        const feedback = {
          interviewId: interviewId,
          userId: userId,
          ...object,
          createdAt: new Date().toISOString(),
        };

        let feedbackRef;
        if (feedbackId) {
          feedbackRef = db.collection("feedback").doc(feedbackId);
        } else {
          feedbackRef = db.collection("feedback").doc();
        }

        await feedbackRef.set(feedback);
        
        revalidatePath(`/interview/${interviewId}/feedback`);
        revalidatePath(`/analytics`);
        revalidatePath(`/`);
        
        return { success: true, feedbackId: feedbackRef.id };
    } catch (error) {
        console.error("Error saving feedback:", error);
        return { success: false };
    }
}

export async function getFeedbackByInterviewId(params: GetFeedbackByInterviewIdParams): Promise<Feedback | null> {
    const { interviewId, userId } = params;
    try {
        const feedback = await db.collection('feedback').where('interviewId', '==', interviewId).where('userId', '==', userId).limit(1).get();
        if(feedback.empty) return null;
        const feedbackDoc = feedback.docs[0];
        return {
            id: feedbackDoc.id,
            ...feedbackDoc.data()
        } as Feedback;
    } catch (e) {
        return null;
    }
}
