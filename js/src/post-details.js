/* global NexT: true */
const __prefix = 'language-'
const __tabs__nav__height = '40px'
 
const __regularExp = new RegExp(`\\b${__prefix}\\w+\\b`)
 
const __label = {
    'language-java': 'Java',
    parse: function(clazz) {
        return this[clazz] ?? clazz.slice(__prefix.length)
    }
}

$('.__tabs').each(function() {
  let flag = true
  const containers = []
  $(this).find(`code[class*=${__prefix}]`).each(function() {
      const matched = $(this).attr('class').match(__regularExp)
      if (!matched || matched.length != 1) {
          flag = false
      }
      const container = $(this).parent()
      if (container.prop('tagName') !== 'PRE') {
          flag = false
      }
      if (!flag) return false
      containers.push({
          label: __label.parse(matched[0]),
          dom: container
      })
  })
  if (!flag || !containers.length) return true
  const header = $('<ul>', {
      class: '__tabs__nav-wrap',
      css: {
          listStyle: 'none',
          userSelect: 'none',
          height: __tabs__nav__height,
          fontSize: 0,
          margin: 0,
          padding: 0
      }
  })
  let actived;
  $.each(containers, function(index, container) {
      const item = $('<li>', {
          text: container.label,
          class: index ? '__tabs__item' : '__tabs__item is-active',
          css: {
              display: 'inline-block',
              position: 'relative',
              lineHeight: __tabs__nav__height,
              fontSize: '16px',
              margin: 0,
              padding: '0 8px'
          }
      })
      container.dom.css('margin-top', 0)
      if (index) container.dom.hide()
      else actived = item
      item.click(function() {
          if (actived == item) return
          $.each(containers, (_, container) => container.dom.hide())
          actived.removeClass('is-active')
          item.addClass('is-active')
          actived = item
          container.dom.show()
      })
      header.append(item)
  })
  $(this).prepend(header)
})


$(document).ready(function () {

  initScrollSpy();

  function initScrollSpy () {
    var tocSelector = '.post-toc';
    var $tocElement = $(tocSelector);
    var activeCurrentSelector = '.active-current';

    $tocElement
      .on('activate.bs.scrollspy', function () {
        var $currentActiveElement = $(tocSelector + ' .active').last();

        removeCurrentActiveClass();
        $currentActiveElement.addClass('active-current');

        // Scrolling to center active TOC element if TOC content is taller then viewport.
        $tocElement.scrollTop($currentActiveElement.offset().top - $tocElement.offset().top + $tocElement.scrollTop() - ($tocElement.height() / 2));
      })
      .on('clear.bs.scrollspy', removeCurrentActiveClass);

    $('body').scrollspy({ target: tocSelector });

    function removeCurrentActiveClass () {
      $(tocSelector + ' ' + activeCurrentSelector)
        .removeClass(activeCurrentSelector.substring(1));
    }
  }

});

$(document).ready(function () {
  var html = $('html');
  var TAB_ANIMATE_DURATION = 200;
  var hasVelocity = $.isFunction(html.velocity);

  $('.sidebar-nav li').on('click', function () {
    var item = $(this);
    var activeTabClassName = 'sidebar-nav-active';
    var activePanelClassName = 'sidebar-panel-active';
    if (item.hasClass(activeTabClassName)) {
      return;
    }

    var currentTarget = $('.' + activePanelClassName);
    var target = $('.' + item.data('target'));

    hasVelocity ?
      currentTarget.velocity('transition.slideUpOut', TAB_ANIMATE_DURATION, function () {
        target
          .velocity('stop')
          .velocity('transition.slideDownIn', TAB_ANIMATE_DURATION)
          .addClass(activePanelClassName);
      }) :
      currentTarget.animate({ opacity: 0 }, TAB_ANIMATE_DURATION, function () {
        currentTarget.hide();
        target
          .stop()
          .css({'opacity': 0, 'display': 'block'})
          .animate({ opacity: 1 }, TAB_ANIMATE_DURATION, function () {
            currentTarget.removeClass(activePanelClassName);
            target.addClass(activePanelClassName);
          });
      });

    item.siblings().removeClass(activeTabClassName);
    item.addClass(activeTabClassName);
  });

  // TOC item animation navigate & prevent #item selector in adress bar.
  $('.post-toc a').on('click', function (e) {
    e.preventDefault();
    var targetSelector = NexT.utils.escapeSelector(this.getAttribute('href'));
    var offset = $(targetSelector).offset().top;

    hasVelocity ?
      html.velocity('stop').velocity('scroll', {
        offset: offset  + 'px',
        mobileHA: false
      }) :
      $('html, body').stop().animate({
        scrollTop: offset
      }, 500);
  });

  // Expand sidebar on post detail page by default, when post has a toc.
  var $tocContent = $('.post-toc-content');
  var isSidebarCouldDisplay = CONFIG.sidebar.display === 'post' ||
      CONFIG.sidebar.display === 'always';
  var hasTOC = $tocContent.length > 0 && $tocContent.html().trim().length > 0;
  if (isSidebarCouldDisplay && hasTOC) {
    CONFIG.motion.enable ?
      (NexT.motion.middleWares.sidebar = function () {
          NexT.utils.displaySidebar();
      }) : NexT.utils.displaySidebar();
  }
});
