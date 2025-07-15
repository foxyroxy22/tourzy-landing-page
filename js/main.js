$(document).ready(function () {
  var page = $(".fullpage").fullpage({
    anchors: ["menu1", "menu2", "menu3", "menu4", "menu5", "menu6"],

    navigation: true,
    navigationTooltips: [],
    navigationPosition: "left",
    showActiveTooltip: true,
    responsiveWidth: 1024,

    // 섹션 이동 시 GNB 활성화 상태 업데이트 - 매개변수 수정
    onLeave: function (index, nextIndex, direction) {
      console.log("onLeave - index:", index, "nextIndex:", nextIndex);
      updateGNBActive(nextIndex);

      // 헤더 스타일 변경
      if (nextIndex == 3 || nextIndex == 5) {
        $("header").addClass("white");
      } else {
        $("header").removeClass("white");
      }
    },
    // 추가로 afterLoad도 사용
    afterLoad: function (anchorLink, index) {
      console.log("afterLoad - index:", index);
      updateGNBActive(index);

      if (index === 2) {
        startCountAnimation();
      }
    },
  }); // fullpage

  // GNB 클릭 이벤트
  $(".gnb li").on("click", function () {
    var sectionNum = $(this).data("section");
    console.log("Clicked section:", sectionNum);
    $.fn.fullpage.moveTo(sectionNum);
  });

  // GNB 활성화 상태 업데이트 함수
  function updateGNBActive(currentSection) {
    console.log("updateGNBActive called with:", currentSection);

    $(".gnb li").removeClass("active");

    var activeGNBSection;
    if (currentSection === 1) activeGNBSection = 1; // Home
    else if (currentSection === 2 || currentSection === 3)
      activeGNBSection = 2; // About Us
    else if (currentSection === 4 || currentSection === 5)
      activeGNBSection = 4; // App
    else if (currentSection === 6) activeGNBSection = 6; // Partner

    console.log("Current Section:", currentSection);
    console.log("Active GNB Section:", activeGNBSection);

    if (activeGNBSection) {
      $('.gnb li[data-section="' + activeGNBSection + '"]').addClass("active");
      console.log(
        "Added active to:",
        $('.gnb li[data-section="' + activeGNBSection + '"]')
      );
    }
  }

  // 초기 로드 시 첫 번째 섹션 활성화
  updateGNBActive(1);

  // home-slide
  const home_slide = new Swiper(".home-slide", {
    navigation: {
      nextEl: ".home-slide-btn .next-btn",
      prevEl: ".home-slide-btn .prev-btn",
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    speed: 800,
    loop: true,

    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
  }); //home_slide

  // 초기 상태 설정 (pause 버튼만 보이게)
  $(".home-slide-btn .pause").show();
  $(".home-slide-btn .resume").hide();

  // pause 버튼 클릭
  $(".home-slide-btn .pause").click(function () {
    home_slide.autoplay.stop();

    // 버튼 토글
    $(this).hide();
    $(".home-slide-btn .resume").show();
  });

  // resume 버튼 클릭
  $(".home-slide-btn .resume").click(function () {
    home_slide.autoplay.start();

    // 버튼 토글
    $(this).hide();
    $(".home-slide-btn .pause").show();
  });

  // 숫자 애니메이션 함수
  function startCountAnimation() {
    $(".num").each(function () {
      const $this = $(this),
        countTo = $this.attr("data-count");

      // HTML에 숫자가 없어도 0부터 시작
      $this.text("0");

      $({
        countNum: 0,
      }).animate(
        {
          countNum: countTo,
        },
        {
          duration: 2000,
          easing: "linear",
          step: function () {
            $this.text(Math.floor(this.countNum));
          },
          complete: function () {
            $this.text(
              this.countNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
          },
        }
      );
    });
  }
  // home 높이 동기화
  function syncHeight() {
    $('.home .main-visual .txt-box').outerHeight($('.home .main-visual .home-slide').height());
  }
  $(window).on('load resize', syncHeight);


  // 각 탭별 swiper 인스턴스를 저장할 배열
  let swipers = [];

  // 초기 설정
  $(".mobile > li").hide();
  $(".mobile > li").eq(0).show();

  // 각 탭별 swiper 초기화 함수
  function initSwiper(index) {
    const screen = new Swiper(`.screen-${index}`, {
      // screen swiper 설정 (필요한 옵션 추가 가능)
    });

    const txt = new Swiper(`.txt-${index}`, {
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      navigation: {
        nextEl: `.btn-${index} .next-btn`,
        prevEl: `.btn-${index} .prev-btn`,
      },
    });

    // 두 swiper 연동
    screen.controller.control = txt;
    txt.controller.control = screen;

    return { screen, txt };
  }

  // 모든 탭의 swiper 초기화 (5개)
  for (let i = 0; i < 5; i++) {
    swipers[i] = initSwiper(i);
  }

  // 탭 클릭 이벤트
  $(".menu ul li").click(function () {
    $(this).addClass("active").siblings().removeClass("active");

    let activeIndex = $(this).index();

    // 탭 내용 표시/숨김
    $(".mobile > li").eq(activeIndex).show().siblings().hide();

    // 활성 탭의 swiper 업데이트 (크기 재계산)
    if (swipers[activeIndex]) {
      swipers[activeIndex].screen.update();
      swipers[activeIndex].txt.update();
    }
  });
}); //end
