$(function () {

  'use strict';

  $(".navbar").sticky({topSpacing:0});

  function getCheckedBoxesOptions(chkboxName) {
    var checkboxes = document.getElementsByName(chkboxName);
    var checkboxesChecked = [];
    // loop over them all
    for (var i=0; i<checkboxes.length; i++) {
       // And stick the checked ones onto an array...
       if (checkboxes[i].checked) {
          checkboxesChecked.push($(checkboxes[i]).data('option'));
       }
    }
    // Return the array if it is non-empty, or null
    return checkboxesChecked.length > 0 ? checkboxesChecked : null;
  }

  function addCropperHTML(number){
    if (number){
      $('#croppingArea').append('<div id="' + number + '" class="img-container ' + number + ' cropperImg dynamicImages"><img id="image" src="img/cat-pouncing.jpg" alt="Picture"></div>');
    }
  }

  function getCheckedBoxesDynamic(chkboxName) {
    var checkboxes = document.getElementsByName(chkboxName);
    var checkboxesNumber = [];
    var checkBoxesRatio = [];
    var cropperObjects = [];
    // loop over them all
    for (var i=0; i<checkboxes.length; i++) {
       // And stick the checked ones onto an array...
       if (checkboxes[i].checked) {
          checkboxesNumber.push( $( checkboxes[i] ).data( 'number' ) );
          checkBoxesRatio.push( $( checkboxes[i] ).data( 'ratio' ) );
          cropperObjects.push( '.' + $( checkboxes[i] ).data( 'number' ) + ' > img' );
       }
    }
    // Return the arrays
    return [
      checkboxesNumber,
      checkBoxesRatio,
      cropperObjects
      ]
  }

  // checks if in dynamic mode
  $('input[type="radio"]').change(function(){
    if(document.getElementById('no').checked) {
      $('.dynamicOptions').attr('disabled',true);
      $('.dynamicButton').attr('disabled',true);
      $('.img-container').show();
      $('.aspectRatio').show();
      $('.dynamicImages').hide();
      $('.select-message').remove();
      $('.multiCrop').show();
    } else {
      $('.dynamicOptions').attr('disabled',false);
      $('.dynamicButton').attr('disabled',false);
      $('.img-container').hide();
      $('.aspectRatio').hide();
      $('.dynamicImages').show();
      $('.multiCrop').hide();
      if ($(".dynamicImages").length < 1){
          $('#croppingArea').append('<h2 class="select-message">Please select an aspect ratio</h2>');
      } else {
        $('.select-message').remove();
      }
    }
  });

  $('.helpButton').click(function(){
    $('#helpModal').modal();
  });
  $('.singleImage').click(function(){
    $('#singleHelp').fadeIn(500);
    $('#multiHelp').hide();
  });
  $('.multipleImages').click(function(){
    $('#singleHelp').hide();
    $('#multiHelp').fadeIn(500);
  });

  // dynamic variables
  var imageRatio;
  var cropperData = [];
  var cropperOptions = [];
  var ratioList = ['two','three','four','five','six'];

  // checks for new aspect ratio and adds it to html
  $('input[name="dynamicOptions"]').change(function(){
    var checking = [];
    imageRatio = getCheckedBoxesDynamic('dynamicOptions');

    for (var i = 0;i < imageRatio[0].length;i++){

      if ($('.'+imageRatio[0][i]).length<1){
        addCropperHTML(imageRatio[0][i]);
      } else  {
        console.log("element " + imageRatio[0][i] + " exists");
      }

      for (var x = 0;x < ratioList.length;x++){
        if (document.getElementById(ratioList[x])){
          if (checking.includes(ratioList[x])){
            console.log('already in array');
          } else {
            checking.push(ratioList[x]);
          }
        }
      }

      for (var t = 0;t <checking.length;t++){
        if(!imageRatio[0].includes(checking[t])){
          $('#'+checking[t]).remove();
        }
      }

    }

    if (imageRatio[0].length == 0){
      $('.dynamicImages').remove();
    }


    if ($(".dynamicImages").length < 1){
      $('#croppingArea').append('<h2 class="select-message">Please Select an aspect ratio</h2>');
    } else {
      $('.select-message').remove();
    }

  });

  $('input[name="dynamicOptions"]').change(function(){
    for (var i = 0;i<imageRatio[0].length;i++){
      cropperData[i] = $(imageRatio[2][i]);
      cropperOptions[i] = {
          aspectRatio: imageRatio[1][i],
          preview: '.img-preview',
          crop: function (e) {
            $dataX.val(Math.round(e.x));
            $dataY.val(Math.round(e.y));
            $dataHeight.val(Math.round(e.height));
            $dataWidth.val(Math.round(e.width));
            $dataRotate.val(e.rotate);
            $dataScaleX.val(e.scaleX);
            $dataScaleY.val(e.scaleY);
          }
        };
      cropperData[i].on({
        'build.cropper': function (e) {
          console.log(e.type);
        },
        'built.cropper': function (e) {
          console.log(e.type);
        },
        'cropstart.cropper': function (e) {
          console.log(e.type, e.action);
        },
        'cropmove.cropper': function (e) {
          console.log(e.type, e.action);
        },
        'cropend.cropper': function (e) {
          console.log(e.type, e.action);
        },
        'crop.cropper': function (e) {
          console.log(e.type, e.x, e.y, e.width, e.height, e.rotate, e.scaleX, e.scaleY);
        },
        'zoom.cropper': function (e) {
          console.log(e.type, e.ratio);
        }
      }).cropper(cropperOptions[i]);

    }
  });

  var console = window.console || { log: function () {} };
  var $image = $('.one > img');
  var $download = $('#download');
  var $dataX = $('#dataX');
  var $dataY = $('#dataY');
  var $dataHeight = $('#dataHeight');
  var $dataWidth = $('#dataWidth');
  var $dataRotate = $('#dataRotate');
  var $dataScaleX = $('#dataScaleX');
  var $dataScaleY = $('#dataScaleY');
  var options = {
        aspectRatio: 16 / 9,
        preview: '.img-preview',
        crop: function (e) {
          $dataX.val(Math.round(e.x));
          $dataY.val(Math.round(e.y));
          $dataHeight.val(Math.round(e.height));
          $dataWidth.val(Math.round(e.width));
          $dataRotate.val(e.rotate);
          $dataScaleX.val(e.scaleX);
          $dataScaleY.val(e.scaleY);
        }
      };


  // Tooltip
  $('[data-toggle="tooltip"]').tooltip();


  // Cropper
  $image.on({
    'build.cropper': function (e) {
      console.log(e.type);
    },
    'built.cropper': function (e) {
      console.log(e.type);
    },
    'cropstart.cropper': function (e) {
      console.log(e.type, e.action);
    },
    'cropmove.cropper': function (e) {
      console.log(e.type, e.action);
    },
    'cropend.cropper': function (e) {
      console.log(e.type, e.action);
    },
    'crop.cropper': function (e) {
      console.log(e.type, e.x, e.y, e.width, e.height, e.rotate, e.scaleX, e.scaleY);
    },
    'zoom.cropper': function (e) {
      console.log(e.type, e.ratio);
    }
  }).cropper(options);


  // Buttons
  if (!$.isFunction(document.createElement('canvas').getContext)) {
    $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
  }

  if (typeof document.createElement('cropper').style.transition === 'undefined') {
    $('button[data-method="rotate"]').prop('disabled', true);
    $('button[data-method="scale"]').prop('disabled', true);
  }


  // Download
  if (typeof $download[0].download === 'undefined') {
    $download.addClass('disabled');
  }


  // Options
  $('.docs-toggles').on('change', 'input', function () {
    var $this = $(this);
    var name = $this.attr('name');
    var type = $this.prop('type');
    var cropBoxData;
    var canvasData;

    if (!$image.data('cropper')) {
      return;
    }

    if (type === 'checkbox') {
      options[name] = $this.prop('checked');
      cropBoxData = $image.cropper('getCropBoxData');
      canvasData = $image.cropper('getCanvasData');

      options.built = function () {
        $image.cropper('setCropBoxData', cropBoxData);
        $image.cropper('setCanvasData', canvasData);
      };
    } else if (type === 'radio') {
      options[name] = $this.val();
    }

    $image.cropper('destroy').cropper(options);
  });

  var allResult = [];

  // Methods
  $('.docs-buttons').on('click', '[data-method]', function () {
    var $this = $(this);
    var data = $this.data();
    var $target;
    var result;
    var dynamicResult = [];
    var manyResult;
    var multipleResult = [];
    var dynamicMultiple = [];

    if ($this.prop('disabled') || $this.hasClass('disabled')) {
      return;
    }

    if ($image.data('cropper') && data.method) {
      data = $.extend({}, data); // Clone a new one

      if (typeof data.target !== 'undefined') {
        $target = $(data.target);

        if (typeof data.option === 'undefined') {
          try {
            data.option = JSON.parse($target.val());
          } catch (e) {
            console.log(e.message);
          }
        }
      }

      if (data.method === 'rotate') {
        $image.cropper('clear');
      }

      // adds image canvas to array on click or button
      if (data.multiple === "many" || data.multiple === "all"){
        manyResult = $image.cropper(data.method, data.option, data.secondOption);
        allResult.push(manyResult);
      }
      // checks image size list, grabs sizes, makes selected image scale to that size
      else if (data.multiple === "Yes"){
          var boxes = getCheckedBoxesOptions('imageSize');
          for (var i = 0;i<boxes.length;i++){
            if (document.getElementById('yes').checked){
              for (var x = 0;x < cropperData.length;x++){
                dynamicMultiple.push(cropperData[x].cropper(data.method, boxes[i], data.secondOption));
                console.log(dynamicMultiple);
              }
            } else {
              multipleResult[i] = $image.cropper(data.method, boxes[i], data.secondOption);
            }
          }
      }
      // grabs the size, converts to canvas
      else {

        if (document.getElementById('yes').checked){
          for (var i = 0;i<imageRatio[0].length;i++){
            dynamicResult[i] = cropperData[i].cropper(data.method, data.option, data.secondOption);
          }
        } else {
          result = $image.cropper(data.method, data.option, data.secondOption);
        }
      }

      if (data.method === 'rotate') {
        $image.cropper('crop');
      }

      switch (data.method) {
        case 'scaleX':
        case 'scaleY':
          $(this).data('option', -data.option);
          break;

        case 'getCroppedCanvas':
          if (data.multiple === 'many'){
            $('#getCroppedCanvasModal').stopPropagation();
          }
          if (data.multiple === 'all'){
            $('#getCroppedCanvasModal').modal().find('.modal-body').html(allResult);
            // download code
            allResult = [];
          }
          if (data.multiple === "Yes"){
            if (document.getElementById('yes').checked){
              $('#getCroppedCanvasModal').modal().find('.modal-body').html(dynamicMultiple);
            } else {
              $('#getCroppedCanvasModal').modal().find('.modal-body').html(multipleResult);
            }
            // $('#getCroppedCanvasModal').modal().find('.modal-body').html(multipleResult);
            // download code
          }
          else {
            if (document.getElementById('yes').checked){
              $('#getCroppedCanvasModal').modal().find('.modal-body').html(dynamicResult);
            } else {
              $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);
            }
            // if (!download.disabled) {
            //   download.href = result.toDataURL('image/jpeg');
            // }
          }

          break;
      }

      if ($.isPlainObject(result) && $target) {
        try {
          $target.val(JSON.stringify(result));
        } catch (e) {
          console.log(e.message);
        }
      }

    }
  });


  // Keyboard
  $(document.body).on('keydown', function (e) {

    if (!$image.data('cropper') || this.scrollTop > 300) {
      return;
    }

    switch (e.which) {
      case 37:
        e.preventDefault();
        $image.cropper('move', -1, 0);
        break;

      case 38:
        e.preventDefault();
        $image.cropper('move', 0, -1);
        break;

      case 39:
        e.preventDefault();
        $image.cropper('move', 1, 0);
        break;

      case 40:
        e.preventDefault();
        $image.cropper('move', 0, 1);
        break;
    }

  });


  // Import image
  var $inputImage = $('#inputImage');
  var URL = window.URL || window.webkitURL;
  var blobURL;

  if (URL) {
    $inputImage.change(function () {
      var files = this.files;
      var file;

      if (!$image.data('cropper')) {
        return;
      }

      if (files && files.length) {
        file = files[0];

        if (/^image\/\w+$/.test(file.type)) {
          blobURL = URL.createObjectURL(file);

          if (document.getElementById('yes').checked){
            for (var i = 0;i<imageRatio[0].length;i++){
              cropperData[i].one('built.cropper', function () {

                // Revoke when load complete
                URL.revokeObjectURL(blobURL);
              }).cropper('reset').cropper('replace', blobURL);
            }
          } else {
            $image.one('built.cropper', function () {

              // Revoke when load complete
              URL.revokeObjectURL(blobURL);
            }).cropper('reset').cropper('replace', blobURL);
          }

          $inputImage.val('');
        } else {
          swal('Whoops!','Please choose an image file','error');
        }
      }
    });
  } else {
    $inputImage.prop('disabled', true).parent().addClass('disabled');
  }

});
