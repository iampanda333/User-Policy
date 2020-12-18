const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const os = require('os');
const { Worker, isMainThread, workerData } = require('worker_threads'); 

const upload = multer({ dest: 'uploads/' });
const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors());

app.post('/upload', upload.single('file'), (req, res) => {
    let promise = new Promise( (resolve, reject) => {
        const filePath = req.file.path;
        const text = fs.readFileSync(filePath, 'utf-8').toString().split('\n');
        const worker = new Worker(__dirname+'/save.js', {
            workerData: { text: text }
        });

        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', () => {
            reject(new  Error(`Worker stopped with an exit code`));
        });
        
    });
    promise.then(() => {
        res.send("saved");
    });
       
});

app.get('/search/:userName', (req, res) => {
    const userName = req.params.userName;
    let promise = new Promise( (resolve, reject) => {
        const worker = new Worker(__dirname+'/search.js', {
            workerData: {userName: userName}
        });

        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', () => {
            reject(new  Error(`Worker stopped`));
        });
        
    });
    promise.then((val) => {
        res.send(val);
    })
});

app.listen(PORT, () => {
    console.log(`server started in port ${PORT}`);
})