require('dotenv').config();
const DASHSCOPE_API_KEY = process.env.AL_API_KEY
var sendEmail = require('./email.js');

// 构建请求体
function videoRequest(prompt = "一个很帅气的男人", size = "1280*720") {
    const requestBody = {
        model: "wanx2.1-t2v-turbo",
        input: {
            prompt
        },
        parameters: {
            "size": "1280*720",
        }
    };

    // 使用 fetch 发起请求
    fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis', {
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
                            console.log('不是200')
                            throw new Error(`HTTP 请求失败，状态码: ${response.status}`);
                        }

                        return response.text()
                    })
                    .then(data => {
                        let res = JSON.parse(data)
                        console.log(res.output.task_status)
                        if (res.output.task_status === "RUNNING") {
                            console.log("任务还在运行中")
                            setTimeout(() => {
                                tryFinish()
                            }, 30000)
                            return
                        }
                        if (res.output.task_status === "SUCCEEDED") {
                            console.log('请求成功，响应数据:', JSON.stringify(data), 123, res.output.video_url, 123)
                            sendEmail('1807797481@qq.com', `你创作的名为"${prompt}"的视频已经生成，若附件无法查看，请通过该链接点击查看：${res.output.video_url}`, 'video.mp4', res.output.video_url)
                        }
                        if (res.output.task_status === "FAILED") {
                            console.log(res)
                            sendEmail('1807797481@qq.com', `你创作的名为"${prompt}"的视频生成失败，错误信息： ${res.output.message}`)
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
videoRequest('testname', 123)
module.exports = videoRequest
// 16:9，1:1，9:16，17:13，13:17
// 1280*720,960*960,720*1280,1088*832,832*1088