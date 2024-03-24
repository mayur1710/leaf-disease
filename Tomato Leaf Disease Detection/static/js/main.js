$(document).ready(function () {
    
    $('#btn-predict').hide();
    $('#placeHolder').show();
    $('#result').hide();
    var myChart = new Chart();

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreview').attr("href", e.target.result)
                $('#imagePreview').hide();
                $('#imagePreview').fadeIn(650);
                $('#btn-predict').hide();
                $('#btn-predict').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#imageUpload").change(function () {
        readURL(this);
    });

    $('#btn-predict').click(function () {
        var form_data = new FormData($('#upload-file')[0]);
        $.ajax({
            type: 'POST',
            url: './predict',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            success: function (data) {
                data = data.filter(element => element[0] != 0);
                if(data.length) {
                    $("#title").text(data[0][1]);
                    $("#title").click(() => window.location.href = data[0][3]);
                    $("#title").css("cursor", "pointer");
                    $("#desc").text(data[0][2]);
                    if(data[0][3] !== "#") {
                        $("#link").text("Learn more.");
                    }
                    else {
                        $("#link").text("");
                    }
                    $("#link").attr("href", data[0][3]);
                    $('#placeHolder').hide();
                    $('#result').show();
                    ScrollReveal().reveal('.feature');
                    myChart.destroy();
                    const ctx = document.getElementById("chart").getContext('2d');
                    myChart = new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            labels: data.map(element => element[1]),
                            datasets: [{
                                label: 'Disease Prediction Results',
                                data: data.map(element => element[0]),
                                backgroundColor: ["#0074D9", "#FF4136", "#2ECC40",
                                    "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00",
                                    "#001f3f", "#39CCCC", "#01FF70", "#85144b",
                                    "#F012BE", "#3D9970", "#111111", "#AAAAAA"
                                ],
                                cutout: "70%",
                                borderRadius: 20
                            }]
                        },
                    });
                    $([document.documentElement, document.body]).animate({
                        scrollTop: $("#result").offset().top
                    }, 1000);
                }
            },
        });
    });

});