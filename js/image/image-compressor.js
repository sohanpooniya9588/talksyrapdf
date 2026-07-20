// ==========================================
// Image Compressor
// File: js/image/image-compressor.js
// ==========================================

async function compressImage(file, quality = 0.7, outputType = "image/jpeg") {
    return new Promise((resolve, reject) => {

        if (!file) {
            reject(new Error("No image selected."));
            return;
        }

        if (!file.type.startsWith("image/")) {
            reject(new Error("Please upload an image file."));
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {

            const img = new Image();

            img.onload = function () {

                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);

                canvas.toBlob(

                    function (blob) {

                        if (!blob) {
                            reject(new Error("Compression failed."));
                            return;
                        }

                        resolve(blob);

                    },

                    outputType,
                    quality

                );

            };

            img.onerror = function () {
                reject(new Error("Unable to load image."));
            };

            img.src = event.target.result;

        };

        reader.onerror = function () {
            reject(new Error("Unable to read image."));
        };

        reader.readAsDataURL(file);

    });
}



// ==========================================
// Download Compressed Image
// ==========================================

function downloadCompressedImage(blob, fileName = "compressed-image.jpg") {

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

}



// ==========================================
// Main Handler
// ==========================================

async function handleImageCompression(file, quality = 0.7) {

    try {

        const compressedBlob = await compressImage(file, quality);

        downloadCompressedImage(compressedBlob);

        return compressedBlob;

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}