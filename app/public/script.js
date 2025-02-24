document.addEventListener("DOMContentLoaded", () => {
    fetch("/list")
        .then(res => res.json())
        .then(files => {
            const list = document.getElementById("pdf-list");
            list.innerHTML = ""; // Clear existing content

            files.forEach(file => {
                const li = document.createElement("li");
                li.style.display = "inline-block";
                li.style.margin = "15px";
                li.style.textAlign = "center";

                // Create the button with an icon
                const button = document.createElement("button");
                button.innerHTML = '<i class="fas fa-file-pdf"></i>';
                button.style.background = "white";
                button.style.border = "none";
                button.style.cursor = "pointer";
                button.style.fontSize = "64px";
                button.style.color = "#33BFD1";
                button.style.display = "block";

                // Set up button click event
                button.addEventListener("click", () => {
                    // Remove existing preview
                    const existingPreview = document.getElementById("pdf-preview-container");
                    if (existingPreview) {
                        existingPreview.remove();
                    }

                    // Create preview container
                    const previewContainer = document.createElement("div");
                    previewContainer.id = "pdf-preview-container";
                    previewContainer.style.textAlign = "center";
                    previewContainer.style.marginTop = "20px";

                    // Create iframe for PDF preview
                    const iframe = document.createElement("iframe");
                    iframe.src = `uploads/${file}`;
                    iframe.style.width = "600px";
                    iframe.style.height = "400px";
                    iframe.style.border = "none";

                    // Close button
                    const closeButton = document.createElement("button");
                    closeButton.textContent = "Schließen";
                    closeButton.style.fontSize = "15px";
                    closeButton.style.marginTop = "10px";
                    closeButton.style.padding = "5px 10px";
                    closeButton.style.background = "#f44336";
                    closeButton.style.color = "white";
                    closeButton.style.border = "none";
                    closeButton.style.borderRadius = "5px";
                    closeButton.style.cursor = "pointer";
                    closeButton.addEventListener("click", () => {
                        previewContainer.remove();
                    });

                    // "Lesen" button for individual URLs based on filename
                    const lesenButton = document.createElement("button");
                    lesenButton.textContent = "Lesen";
                    lesenButton.style.fontSize = "15px";
                    lesenButton.style.marginTop = "10px";
                    lesenButton.style.padding = "5px 10px";
                    lesenButton.style.background = "#33BFD1";
                    lesenButton.style.color = "white";
                    lesenButton.style.border = "none";
                    lesenButton.style.cursor = "pointer";

                    // Check the file name to determine the URL
                    if (file === "Szene 2021.pdf") {
                        lesenButton.addEventListener("click", () => {
                            window.location.href = "https://szene-2021.glitch.me"; // URL for Szene 2021
                        });
                    } else if (file === "Szene 2023.pdf") {
                        lesenButton.addEventListener("click", () => {
                            window.location.href = "https://szene-2023.glitch.me"; // URL for Szene 2023
                        });
                    }

                    // Download button
                    const downloadButton = document.createElement("a");
                    downloadButton.textContent = "Herunterladen";
                    downloadButton.style.display = "inline-block";
                    downloadButton.style.marginTop = "5px";
                    downloadButton.style.padding = "5px 10px";
                    downloadButton.style.background = "#33BFD1";
                    downloadButton.style.color = "white";
                    downloadButton.style.textDecoration = "none";
                    downloadButton.style.border = "none";
                    downloadButton.style.borderRadius = "5px";
                    downloadButton.style.cursor = "pointer";
                    downloadButton.href = `uploads/${file}`;
                    downloadButton.download = file;
                    downloadButton.target = "_blank";

                    // Append elements
                    previewContainer.appendChild(iframe);
                    previewContainer.appendChild(closeButton);
                    previewContainer.appendChild(lesenButton); // "Lesen" button
                    previewContainer.appendChild(downloadButton);

                    li.appendChild(previewContainer);
                });

                // File name below icon
                const filenameText = document.createElement("span");
                filenameText.textContent = file;
                filenameText.style.display = "block";
                filenameText.style.marginTop = "2px";
                filenameText.style.fontSize = "14px";
                filenameText.style.color = "#333";

                li.appendChild(button);
                li.appendChild(filenameText);
                list.appendChild(li);
            });
        })
        .catch(err => console.error("Fehler beim Laden der PDFs:", err));
});
