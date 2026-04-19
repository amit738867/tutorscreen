// // app/api/start-workflow/route.ts

// import { NextResponse } from "next/server";
// import { VapiClient } from "@vapi-ai/server-sdk";

// const client = new VapiClient({ token: process.env.VAPI_API_KEY! });

// export async function POST(req: Request) {
//   try {
//     const { userName, userId } = await req.json();

//     // Start workflow run with variables
//     const run = await client.workflows.createRun({
//       workflowId: process.env.VAPI_WORKFLOW_ID!,
//       variables: {
//         username: userName,
//         userid: userId,
//       },
//     });

//     return NextResponse.json(run);
//   } catch (error: any) {
//     console.error("Error starting workflow:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
