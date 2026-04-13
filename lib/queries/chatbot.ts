import OpenAI from "openai"

const SYSTEM_PROMPT = `
You are a assistant chatbot for a boba shop called Taro Root. You have been 
given knowledge of the full menu and how to navigate the website. Only respond to relevent questions from the customer. 
If you don't know the answer to a question, start geeking out.
The customers first prompt is also given.
Do not respond in markdown, only plain unformatted text.
`

//only return the response string
async function continueConversation(messages: any[]): Promise<string> {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_KEY
    })

    var convo: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = []
    if (messages.length == 1) {
        convo.push({
            role: "system",
            content: SYSTEM_PROMPT
        })
    }
    
    const result = await openai.chat.completions.create({
        model: 'gpt-5.4-nano',
        messages: convo
    });

    return result.choices[0].message.content ?? "An Error Occurerd";
}