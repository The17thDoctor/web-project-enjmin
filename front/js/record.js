if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Request access to the user's microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            // Create a MediaRecorder instance and pass the stream as input
            var mediaRecorder = new MediaRecorder(stream);

            // Create an array to store the recorded chunks
            var chunks = [];

            // Event handler for when data is available
            mediaRecorder.ondataavailable = function (event) {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            // Event handler for when recording is stopped
            mediaRecorder.onstop = function () {
                // Combine the recorded chunks into a single Blob
                var blob = new Blob(chunks, { type: 'audio/wav' });

                // You can now use the blob as needed, for example, upload it to a server
                // or create a download link
                var url = URL.createObjectURL(blob);
                // Do something with the URL, e.g., create a download link
                var a = document.createElement('audio');
                document.body.appendChild(a);
                a.controls = true;
                a.src = url
            };

            // Start recording when the user clicks a button or takes another action
            // For example, you can use a button element with an onclick event handler
            document.getElementById('startRecording').onclick = function () {
                mediaRecorder.start();
            };

            // Stop recording when the user clicks another button or takes another action
            document.getElementById('stopRecording').onclick = function () {
                mediaRecorder.stop();
            };
        })
        .catch(function (err) {
            console.error('Error accessing microphone:', err);
        });
} else {
    console.error('MediaRecorder API not supported in this browser');
}