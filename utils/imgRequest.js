require('dotenv').config();
const DASHSCOPE_API_KEY = process.env.AL_API_KEY
var sendEmail = require('./email.js');

// 构建请求体
function imgRequest(prompt = "一个很帅气的男人", size = "1024*1024") {
    const requestBody = {
        model: "wanx2.1-t2i-turbo",
        input: {
            "prompt": "一个很帅气的男人出现在宇宙中，宇宙有1000颗星星，100颗星球"
        },
        "parameters": {
            "size": "1024*1024",
        }
    };

    // 使用 fetch 发起请求
    fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis', {
        method: 'POST',
        headers: {
            'X-DashScope-Async': 'enable',
            'Authorization': `Bearer ${DASHSCOPE_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP 请求失败，状态码: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('请求成功，响应数据:', data);
            const url = `https://dashscope.aliyuncs.com/api/v1/tasks/${data.output.task_id}`;
            function tryFinish() {
                fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${DASHSCOPE_API_KEY}`
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            // 如果响应状态码不是 200 - 299 范围，抛出错误
                            throw new Error(`HTTP 请求失败，状态码: ${response.status}`);
                        }
                        // 将响应数据解析为 JSON 格式
                        return response.text()
                    })
                    .then(data => {
                        let res = JSON.parse(data)
                        if (res.output.task_status === "RUNNING") {
                            console.log("任务还在运行中")
                            setTimeout(() => {
                                tryFinish()
                            }, 10000)
                            return
                        }
                        if (res.output.task_status === "SUCCEEDED") {
                            console.log('请求成功，响应数据:', JSON.stringify(data), 123, res.output.results, 123)
                            sendEmail('1807797481@qq.com', `你创作的名为"${res.output.results[0].orig_prompt}"的图片已经生成，若附件无法查看，请通过该链接点击查看：${res.output.results[0].url}`, 'img.png', res.output.results[0].url)
                        }
                        if (res.output.task_status === "FAILED") {
                            sendEmail('1807797481@qq.com', `你创作的名为"${res.output.results[0].orig_prompt}"的图片生成失败，错误信息：${res.output.message}`)
                        }
                        // 打印请求成功后的响应数据
                    })
                    .catch(error => {
                        // 捕获并打印请求过程中出现的错误
                        console.error('请求出错:', error);
                    });
            }
            tryFinish()
        })
        .catch(error => {
            console.error('请求出错:', error);
        });
}
imgRequest()
// 4:3，1:1，3:4，16:9
// 1024*768,1024,1024*768,1366×768,1366×768
module.exports = imgRequest