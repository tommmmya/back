async function aiRequest(botId, req, res) {
    try {
        const OpenAI = require('openai');
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');
        const openai = new OpenAI({
            apiKey: '9c88e941-7e3e-4c17-932d-7329aaae546f',
            baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
        });
        const stream = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: '你是豆包，是由字节跳动开发的 AI 人工智能助手' },
                { role: 'user', content: '常见的十字花科植物有哪些？' },
            ],
            model: 'ep-20250126145816-jmstx',
            stream: true,
        });
        for await (const part of stream) {
            process.stdout.write(part.choices[0]?.delta?.content || '');
            res.write(part.choices[0]?.delta?.content)
            if (res.flush) {
                res.flush();
            }
        }
        res.end()
        process.stdout.write('\n');

    } catch (error) {
        res.status(500).send(error)
    }
}
module.exports = aiRequest;