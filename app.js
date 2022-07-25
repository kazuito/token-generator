const { createApp } = Vue;

createApp({
  data() {
    return {
      token_length: 15,
      token: "",
      token_result: "",
      letters: {
        lowercase: "abcdefghijklmnopqrstuvwxyz",
        uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        number: "0123456789",
        symbol: "!@#$%^&*()_+-=[]{};':\".,/>?`~\\|",
        valid_in_url_symbol: "-_",
        custom: "",
      },
      options: {
        lowercase: true,
        uppercase: true,
        number: true,
        symbol: false,
        ex_ambiguous: false,
        ex_unwise: false,
      },
      tooltip_text_copy: "Copy",
    };
  },
  methods: {
    submitted: function () {
      this.generateToken();
      $(".submit-btn").removeClass("clicked");
      $(".submit-btn").height();
      $(".submit-btn").addClass("clicked");
      $(".result-input-box").removeClass("e");
      $(".result-input-box").height();
      $(".result-input-box").addClass("e");
    },
    generateToken: function () {
      this.token = "";
      let letters = this.getLetters();
      if (this.token_length <= 100000 && letters.length > 0) {
        for (let i = 0; i < this.token_length; i++) {
          let rnd = this.getRnd(letters.length);
          this.token += letters[rnd];
        }
        this.token_result = this.token;
      } else {
        this.token_result = "";
      }
    },
    getLetters: function () {
      let letters = "";
      letters += this.letters.custom;
      if (this.options.lowercase) letters += this.letters.lowercase;
      if (this.options.uppercase) letters += this.letters.uppercase;
      if (this.options.number) letters += this.letters.number;
      if (this.options.symbol) {
        if (!this.options.ex_unwise) {
          letters += this.letters.symbol;
        } else letters += this.letters.valid_in_url_symbol;
      }
      if (this.options.ex_ambiguous) letters = letters.replace(/[1lIoO0]/g, "");
      if (this.options.ex_unwise)
        letters = letters.replace(
          /[^abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_]/g,
          ""
        );
      return letters;
    },
    getRnd: function (max) {
      return Math.floor((Math.random() * 999999) % max);
    },
    copyToClipboard: function () {
      $(".result-input-box").select();
      document.execCommand("copy");
      $(".result-input-box").val(this.token_result + " ");
      $(".result-input-box").val(this.token_result);
    },
    lengthMousedown: function (e) {
      console.log("down");
      let start_x = e.pageX;
      let opt_length_scroll_started = true;
      $("body").addClass("cursor-e-resize");
      $("body").on("mouseup mouseleave touchend", function (e) {
        $("body").removeClass("cursor-e-resize");
        opt_length_scroll_started = false;
      });
      let init_value = $(".opt-length input").val();
      $("body").on("touchmove mousemove", (e) => {
        if (opt_length_scroll_started) {
          this.token_length =
            Math.floor(init_value) + Math.round((e.pageX - start_x) / 3);
        }
      });
    },
  },
  computed: {
    token_length_validation: function () {
      let tl = this.token_length;
      if (tl <= 0) this.token_length = 0;
      if (tl >= 1) this.token_length = tl.toString().replace(/^0*/, "");
      if (this.token_length.toString().match(/\./))
        this.token_length = tl.toString().replace(/\./g, "");
      {
      }
      if (this.token_length > 100000 || this.token_length <= 0) {
        return "invalid";
      } else return "valid";
    },
  },
}).mount("#app");

$(".submit-btn,.copy-btn").click(function (e) {
  e.preventDefault();
});

$(".copy-btn").click(function () {
  $(".copy-btn").height();
  $(".copy-btn").addClass("clicked");
  $(".copy-btn .popup-tooltip").html("Copied!");
  sto = setTimeout(() => {
    $(".copy-btn").removeClass("clicked");
    $(".copy-btn .popup-tooltip").html("Copy");
  }, 1000);
});

$(".copy-btn").hover(function () {
  $(this).toggleClass("hover");
});
