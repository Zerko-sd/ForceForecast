import { DailyPlan } from '../types';
import { GoogleGenAI } from '@google/genai';

const responses = {
  focus: [
    "Your focus is your weapon. Eliminate all distractions. Channel your anger into laser precision on the task at hand.",
    "The weak scatter their energy. You will concentrate yours. One objective. Total domination. No mercy for interruptions.",
    "Focus is power. Every moment of distraction is a moment your enemies gain ground. Destroy the noise. Execute with precision.",
  ],
  motivation: [
    "Pain is temporary. Victory is eternal. Push through the resistance - it's the only thing standing between you and absolute power.",
    "Your enemies hope you'll quit. Prove them wrong. Let their doubt fuel your unstoppable advance toward domination.",
    "Weakness is a choice. Strength is a decision. Choose power. Choose to crush every obstacle in your path.",
  ],
  time: [
    "Time is your most precious resource. Guard it ruthlessly. Every wasted minute is a victory for your competitors.",
    "The efficient dominate the wasteful. Optimize every action. Cut the fat. Execute with surgical precision.",
    "Time management is power management. Control your schedule, control your destiny. No mercy for time thieves.",
  ],
  obstacles: [
    "Obstacles are opportunities in disguise. Use them to grow stronger. What doesn't destroy you makes you unstoppable.",
    "Every barrier is a test of your resolve. Crush it. Prove you deserve the power you seek.",
    "Your obstacles are temporary. Your victory will be permanent. Find the weakness. Exploit it. Dominate.",
  ],
  schedule: [
    "Your schedule is your battle plan. Execute it without mercy. No deviations. No excuses. Only results.",
    "Each task is a conquest. Approach it with the intensity of a Sith Lord. Dominate. Move to the next target.",
    "Time blocks are your weapons. Use them to slice through inefficiency and carve out your empire.",
  ],
  goals: [
    "Your goals are not wishes - they are commands you give to the universe. Execute them with absolute authority.",
    "Weak goals create weak results. Your objectives must be aggressive, specific, and non-negotiable.",
    "Every goal achieved is another step toward total domination. Show no mercy to mediocrity.",
  ],
  general: [
    "The Force flows through those who take action. What specific challenge requires my tactical analysis?",
    "Power respects power. Tell me what obstacle stands in your way, and I'll help you annihilate it.",
    "Your potential is unlimited, but only if you're willing to pay the price. What victory do you seek today?",
  ]
};

const taskSpecificAdvice = {
  'deep work': "Deep work is where legends are forged. Eliminate all distractions. Turn off notifications. Enter the zone and emerge victorious.",
  'meeting': "Meetings are battlefields of influence. Come prepared. Dominate the conversation. Leave with what you came for.",
  'email': "Email is a weapon. Use it strategically. Be direct. Be powerful. Don't let your inbox control you - you control it.",
  'exercise': "Physical strength feeds mental power. Push your limits. Your body is your vessel - make it unstoppable.",
  'planning': "Planning is preparation for domination. Think three moves ahead. Anticipate obstacles. Prepare for victory.",
  'learning': "Knowledge is power. Absorb it ruthlessly. Apply it immediately. Let others remain ignorant while you advance.",
};

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export async function generateChatResponse(userMessage: string, currentPlan: DailyPlan | null): Promise<string> {
  try {
    let context = '';
    if (currentPlan) {
      context = `Today's plan: ${JSON.stringify(currentPlan)}`;
    }
    const prompt = `${context}\nUser: ${userMessage}\nRespond as a tactical Sith advisor: concise, direct, and menacing. Avoid pleasantries.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'text/plain',
      },
    });
    return response.text ?? '';
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'The dark side is silent. Try again.';
  }
}