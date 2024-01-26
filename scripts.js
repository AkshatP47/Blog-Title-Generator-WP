document.getElementById("generate-button").addEventListener("click", function(e){
    e.preventDefault();
    
    var generateButton = document.getElementById("generate-button");
    
    if (generateButton.disabled) {
        return; // Prevent multiple clicks while content is being generated
    }
    
    generateButton.disabled = true;
    
    var topic = document.getElementById('topic').value;
    var blogTitleGeneratorPrompt = "As a skilled blogger, your task is to generate 10 blog post titles based on the topic: " + topic + ". Craft titles that are attention-grabbing, accurately represent the content, and optimize for SEO. Be creative and make sure the titles resonate with your target audience.";
    var loading = document.getElementById('loading');
    var result = document.getElementById('result-wrapper'); // Changed to result-wrapper
    var resultC = document.getElementById('result-container');

    loading.style.display = 'block';
    result.style.display = 'none'; // hide result wrapper
    resultC.style.display = 'none';

    var formData = new FormData();
    formData.append('action', 'openai_generate_text');
    formData.append('prompt', blogTitleGeneratorPrompt);

    fetch('/wp-admin/admin-ajax.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        loading.style.display = 'none';
        if(data.success) {
            result.innerText = data.data.choices[0].message.content;
            result.style.display = 'block'; // show result wrapper
            resultC.style.display = 'block';
            generateButton.disabled = false;
        } else {
            result.innerText = 'An error occurred: ' + data.data;
            result.style.display = 'block'; // show result wrapper
            resultC.style.display = 'block';
            generateButton.disabled = false;
        }
    })
    .catch(error => {
        loading.style.display = 'none';
        result.innerText = 'An error occurred: ' + error.message;
        result.style.display = 'block'; // show result wrapper
        resultC.style.display = 'block';
        generateButton.disabled = false;
    });
});

var copyAllButton = document.getElementById('copy-all-button');
copyAllButton.addEventListener('click', function () {
    var result = document.getElementById('result-wrapper');
    var tempTextArea = document.createElement('textarea');
    tempTextArea.value = result.innerText;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
    alert('Copied to clipboard!');
});
