const input = document.getElementById("input");
const convertButton = document.getElementById("convertButton");
const downloadLink = document.getElementById("downloadLink");
const result = document.getElementById("result");

// Input validation schema using Joi library
const schema = Joi.object({
  files: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        type: Joi.string().valid("image/jpeg").required(),
        size: Joi.number().max(1000000).required(),
      })
    )
    .max(1)
    .required(),
});

const convertToWebP = () => {
  const file = input.files[0];

  // Validate the input file
  const { error } = schema.validate({ files: [file] });
  if (error) {
    result.style.display = "block";
    result.innerHTML = `<p>Error: ${error.message}</p>`;
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const arrayBuffer = reader.result;
    const blob = new Blob([new Uint8Array(arrayBuffer)], { type: "image/jpeg" });

    // Convert the JPEG blob to a WebP blob
    const image = new Image();
    image.src = URL.createObjectURL(blob);
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.getContext("2d").drawImage(image, 0, 0);

      canvas.toBlob((webpBlob) => {
        // Create a download link for the converted file
        const downloadURL = URL.createObjectURL(webpBlob);
        downloadLink.href = downloadURL;
        result.style.display = "block";
      }, "image/webp", 0.8);
    };
  };

  reader.readAsArrayBuffer(file);
};

convertButton.addEventListener("click", convertToWebP);
