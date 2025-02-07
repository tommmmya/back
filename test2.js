const DASHSCOPE_API_KEY = '';



// 构建请求体
const requestBody = {
    "model": "wanx2.1-t2i-turbo",
    "input": {
        "prompt": "一个很帅气的男人出现在宇宙中，宇宙有1000颗星星，100颗星球"
    },
    "parameters": {
        "size": "1024*1024",
        "n": 1
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
        setTimeout(() => {
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
                    // 打印请求成功后的响应数据
                    console.log('请求成功，响应数据:', JSON.stringify(data), 123, res.output.results, 123)
                })
                .catch(error => {
                    // 捕获并打印请求过程中出现的错误
                    console.error('请求出错:', error);
                });
        }, 20000)
    })
    .catch(error => {
        console.error('请求出错:', error);
    });




// const taskId = '86ecf553-d340-4e21-xxxxxxxxx';

// 构建请求 URL


// 使用 fetch 发起请求
