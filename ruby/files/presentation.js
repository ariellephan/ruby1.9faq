var Presentation = function() {
  var slides = null;
  var current_slide = 0;
  var num_slides = 0;

  function set_current_slide(index) {
    current_slide = index;

    var slide = $(slides.get(index));

    slides.not(slide).hide();
    slide.show();

    // Update hash if this slide has an @id
    var id = slide.attr('id');
    if (id) {
      location.hash = id;
    }
  }

  function set_slide(offset) {
    var index = current_slide + offset;
    if (index < 0) index = 0;
    if (index > (num_slides-1)) index = (num_slides-1);
    set_current_slide(index);
  }

  function previous_slide() {
    set_slide(-1);
    return false;
  }

  function next_slide() {
    set_slide(1);
    return false;
  }

  // Run through the slides automatically, switching every 15 seconds.
  function ignite() {
    $('#ignite').hide();
    setInterval(next_slide, 15*1000);
    return false;
  }

  function handle_keys(event) {
    /* Skip events with modifier keys */
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return true;
    } else {
      /* Squash propagation of key events so WebKit-based browsers
       * don't see two of everything.
       */
      event.stopPropagation();
      event.preventDefault();
    }

    switch (event.keyCode) {
    case $.ui.keyCode.HOME:
      set_current_slide(0);
      break;
    case $.ui.keyCode.END:
      set_current_slide(num_slides-1);
      break;
    case $.ui.keyCode.ENTER:
    case $.ui.keyCode.SPACE:
    case $.ui.keyCode.RIGHT:
      next_slide();
      break;
    case $.ui.keyCode.LEFT:
      previous_slide();
      break;
    default:
      break;
    }
    return false;
  }

  return function() {
      slides = $('article.deck > section');
      num_slides = slides.size();

      // If there's a hash, start there instead of the first slide
      if (location.hash != "") {
        set_current_slide(slides.index($(location.hash).get(0)));
      } else {
        set_current_slide(0);
      }

      $('#previous-slide').click(previous_slide);
      $('#next-slide').click(next_slide);
      var ignite = $('#ignite');
      if (ignite.size() > 0) {
          $('#ignite').click(ignite);
      } else {
          // avoid binding keys in ignite slides due to
          // contenteditable="" demo
          $('html').bind('keydown', handle_keys);
      }
    };
}();

$(document).ready(Presentation);
