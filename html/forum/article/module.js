article_app.value('froalaConfig', {
    toolbarInline: false,
    language: 'zh_cn',
    heightMin: 200,
    heightMax: 400,
    placeholderText: 'Enter Text Here',
    //---------文件-----------
    // Set the file upload parameter.
    fileUploadParam: 'upfile',

    // Set the file upload URL.
    fileUploadURL: 'http://localhost:8080/api/editorFileUpload',

    // Additional upload params.
    fileUploadParams: {id: 'my_editor'},

    // Set request type.
    fileUploadMethod: 'POST',

    // Set max file size to 20MB.
    fileMaxSize: 20 * 1024 * 1024,

    // Allow to upload any file.
    fileAllowedTypes: ['*'],
    //------------图片--------------
    // Set the image upload parameter.
    imageUploadParam: 'upfile',

    // Set the image upload URL.
    imageUploadURL: 'http://localhost:8080/api/editorFileUpload',

    // Additional upload params.
    imageUploadParams: {id: 'my_editor'},

    // Set request type.
    imageUploadMethod: 'POST',

    // Set max image size to 5MB.
    imageMaxSize: 10 * 1024 * 1024,

    // Allow to upload PNG and JPG.
    imageAllowedTypes: ['jpeg', 'jpg', 'png']
});