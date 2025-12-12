// src/app/messages/page.js
import { getMyConversations, getUserById } from "../actions"; // getUserById eklendi
import { prisma } from "../lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import MessagesClient from "./MessagesClient";

export default async function MessagesPage({ searchParams }) {
  const session = (await cookies()).get("session")?.value;
  
  // URL'deki ?userId=... parametresini al (Next.js 15+ için await gerekebilir)
  const { userId: targetUserId } = await searchParams; 

  let user = null;
  let conversations = [];
  let targetUser = null;

  if (session) {
    try {
        const secret = new TextEncoder().encode("civildai");
        const { payload } = await jwtVerify(session, secret);
        user = await prisma.user.findUnique({ where: { email: payload.email } });
        
        if(user) {
            conversations = await getMyConversations(user.id);
            
            // Eğer URL'de bir hedef kullanıcı varsa, onun bilgilerini çek
            if (targetUserId && targetUserId !== user.id) {
                targetUser = await getUserById(targetUserId);
            }
        }
    } catch(e) {}
  }

  return <MessagesClient currentUser={user} initialConversations={conversations} targetUser={targetUser} />;
}