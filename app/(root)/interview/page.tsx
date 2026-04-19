import React from 'react'
import Agent from "@/components/Agent"
import { getCurrentUser } from "@/lib/actions/auth.action"

const page = async () => {

  const user = await getCurrentUser();

  return (
    <>
        <Agent 
          userName={user?.name!} 
          userId={user?.id!} 
          type="generate" 
          persona={user?.persona}
          voiceEnabled={user?.voiceEnabled}
        />
    </>
  )
}

export default page
