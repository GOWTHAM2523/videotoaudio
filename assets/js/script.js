document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInfo = document.getElementById('fileInfo');
    const convertButton = document.getElementById('convertButton');
    const loader = document.getElementById('loader');
    const output = document.getElementById('output');
    const downloadLink = document.getElementById('downloadLink');
    const renameBox = document.getElementById('renameBox');
    const fileNameInput = document.getElementById('fileName');
    const renameButton = document.getElementById('renameButton');

    let videoFile = null;
    let previousFileName = "";

    const saveToSession = () => {
        sessionStorage.setItem("videoFileName", videoFile?.name || "");
        sessionStorage.setItem("audioFileName", downloadLink.download || "");
        sessionStorage.setItem("changedFileName", fileNameInput.value || "");
    };

    const loadFromSession = () => {
        const videoName = sessionStorage.getItem("videoFileName");
        const audioName = sessionStorage.getItem("audioFileName");
        const changedName = sessionStorage.getItem("changedFileName");

        if (videoName) {
            fileInfo.textContent = `Previously selected file: ${videoName}`;
            fileInfo.classList.remove("hidden");
        }
        if (audioName) {
            downloadLink.download = audioName;
        }
        if (changedName) {
            fileNameInput.value = changedName;
        }
    };

    loadFromSession();

    const handleFileSelect = (file) => {
        videoFile = file;
        previousFileName = file.name;
        fileInfo.textContent = `Selected file: ${file.name}`;
        fileInfo.classList.remove('hidden');
        convertButton.disabled = false;
        saveToSession();
    };

    dropZone.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'video/*';
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length === 1) {
                handleFileSelect(fileInput.files[0]);
            }
        });
        fileInput.click();
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length === 1) {
            handleFileSelect(e.dataTransfer.files[0]);
        } else {
            alert('Please drop only one file at a time.');
        }
    });

    convertButton.addEventListener('click', () => {
        if (!videoFile) return alert("Please select a video file!");

        loader.classList.remove('hidden');
        convertButton.disabled = true;

        const videoUrl = URL.createObjectURL(videoFile);
        const audioContext = new AudioContext();
        const audioElement = new Audio(videoUrl);

        const sourceNode = audioContext.createMediaElementSource(audioElement);
        const destination = audioContext.createMediaStreamDestination();

        sourceNode.connect(destination);

        const recorder = new MediaRecorder(destination.stream);
        const chunks = [];

        recorder.ondataavailable = (e) => chunks.push(e.data);

        recorder.onstop = () => {
            const audioBlob = new Blob(chunks, { type: 'audio/mp3' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const defaultFileName = videoFile.name.replace(/\.[^/.]+$/, "") + ".mp3";
            downloadLink.href = audioUrl;
            downloadLink.download = defaultFileName;
            fileNameInput.value = defaultFileName;
            renameBox.classList.remove('hidden');
            output.classList.remove('hidden');
            loader.classList.add('hidden');
            convertButton.disabled = false;
            saveToSession();
        };

        audioElement.onloadedmetadata = () => {
            recorder.start();
            audioElement.play();

            setTimeout(() => {
                audioElement.pause();
                recorder.stop();
            }, audioElement.duration * 1000);
        };
    });

    renameButton.addEventListener('click', () => {
        const newFileName = fileNameInput.value.trim();
        if (!newFileName) {
            alert("File name cannot be empty!");
            return;
        }
        if (newFileName === downloadLink.download) {
            alert("Name not changed. Please use a different name.");
            return;
        }
        const prevName = downloadLink.download;
        downloadLink.download = newFileName;
        alert(`Name changed from "${prevName}" to "${newFileName}".`);
        saveToSession();
    });

    downloadLink.addEventListener("click", () => {
        const message = document.createElement("div");
        message.textContent = "Thank you for using Developer Gowtham's tool";
        message.style.position = "fixed";
        message.style.top = "50%";
        message.style.left = "50%";
        message.style.transform = "translate(-50%, -50%)";
        message.style.background = "#4caf50";
        message.style.color = "#fff";
        message.style.padding = "20px";
        message.style.borderRadius = "10px";
        message.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
        message.style.zIndex = "1000";
        document.body.appendChild(message);

        setTimeout(() => {
            document.body.removeChild(message);
        }, 2000);
    });



});


// email code



// Initialize emailjs
(function () {
    emailjs.init("hdueE7bUifAPG9EJh"); // Replace with your Public Key
})();

// Example to programmatically show the popup
const successPopup = document.getElementById('successPopup');
const myModal = successPopup ? new bootstrap.Modal(successPopup) : null;

// Function to send email
function sendEmail(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get form values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // Template parameters for emailjs
    const templateParams = {
        to_name: "gowtham", // Recipient name
        from_name: name, // Sender name
        from_email: email, // Sender email
        message: message, // Message content
        reply_to: email // Reply-to email address
    };

    // Send email using emailjs
    emailjs.send("service_hiqcowq", "template_b0yggtu", templateParams)
        .then(() => {
            // Show success popup or alert
            if (myModal) {
                myModal.show();
            } else {
                alert("Email Sent Successfully!");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Failed to send the email. Check the console for details.");
        });

    // Reset the form
    document.getElementById("contactfrom").reset();
}
