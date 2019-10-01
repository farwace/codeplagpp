$('document').ready(function () {
    $('input[type=file]').on('change', function () {
        files = this.files;
    });

    $('#loadSourceCode').on('submit', function (event) {
        event.preventDefault();
        if (typeof files == 'undefined') return;
        var data = new FormData();

        $.each(files, function (key, value) {
            data.append(key, value);
        });
        data.append('fileUploaded', '1');

        var actionUrl = $('#loadSourceCode').attr('action');

        $.ajax({
            url: actionUrl,
            processData: false,
            contentType: false,
            data: data,
            cache: false,
            type: 'POST',
            success: function (response) {
                processUploadDir(response.folder);
            },
            error: function (jqXHR, status, test) {
                console.log(jqXHR);
                console.log(status);
                console.log(test);
            }
        });
    });

    $('#loadSourceCode input[type="file"]').change(function(e){
        var fileName = e.target.files[0].name;
        $('#loadSourceCode .title').text(fileName);
    });
    $('a.goback').on('click',function () {
        $('#loadSourceCode input[type="file"]').val('');
        $('#loadSourceCode .title').text('Загрузите файл');
        $('#loadSourceCode').show();
        $('#form-shadow').show();
        $('.main-title').text('Загрузите файл для проверки');
        $('#results').hide();
        $('a.goback').hide();
        $('.table-of-results').html('');
        $('.plagiat').remove();
    });
});

function processUploadDir(folder) {
    $('#loadSourceCode').hide();
    $('#form-shadow').hide();
    $('.main-title').text('Результат проверки загруженного файла');
    $.ajax({
        url: 'check.php',
        data: {
            folder: folder
        },
        type: 'POST',
        success: function(response) {
            resultOfCheck(response);
            console.log(response);
        },
        error: function (jqXHR, status, test) {
            $('#loadSourceCode').show();
            $('#form-shadow').show();
            $('.main-title').text('Загрузите файл для проверки');
            alert('Ошибка');
            console.log(jqXHR);
            console.log(status);
            console.log(test);
        }
    });
}

function resultOfCheck(response) {
    $('.table-of-results').append('<div class="clear">');
    var eq = 0;
    var j = 0;
    var sum = 0;
    $(response).each(function (i,e) {
        eq = (Math.round(100-Number(e['uniqueness'])));
        sum+=eq;
        j++;
        $('#results').show();
        $('.table-of-results').append('' +
            '<div class="row">' +
            '<div class="col-sm-4">'+e['upload_file']+'</div>' +
            '<div class="col-sm-4">'+e['source_file']+'</div>' +
            '<div class="col-sm-4 orange">совпадает на '+ eq +'%</div>' +
            '</div>'
        );
    });
    $('#results').append('' +
        '<div class="clear plagiat"></div>' +
        '<div class="text-center plagiat">' +
        '<div class="'+ ((sum/j>50)?'red ':'')+ 'text-uppercase">Плагиат '+(Math.round(sum/j))+'%</div>' +
        '' + ((sum/j>50)?'<div class="recommended">Рекомендуем отправить на доработку</div>':'') +
        '</div>'
    );
    $('a.goback').show();
}