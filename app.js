const { createApp } = Vue;

createApp({
  data() {
    return {
      token_length: 15,
      visibility: {
        state: 1,
      },
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
      option_names: {
        lowercase: "lowercase",
        uppercase: "uppercase",
        number: "number",
        symbol: "symbol",
        ex_ambiguous: "ex_ambiguous",
        ex_unwise: "ex_unwise",
      },
      options: {
        lowercase: true,
        uppercase: true,
        number: true,
        symbol: false,
        ex_ambiguous: false,
        ex_unwise: false,
      },
      settings: {
        scheme: "default",
        device_scheme: "light",
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
      $(".result-input-wrapper").removeClass("e");
      $(".result-input-wrapper").height();
      $(".result-input-wrapper").addClass("e");
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
      if (this.options.lowercase) {
        letters += this.letters.lowercase;
      }
      if (this.options.uppercase) {
        letters += this.letters.uppercase;
      }
      if (this.options.number) {
        letters += this.letters.number;
      }
      if (this.options.symbol) {
        if (this.options.ex_unwise === false) {
          letters += this.letters.symbol;
        } else {
          letters += this.letters.valid_in_url_symbol;
        }
      }
      if (this.options.ex_ambiguous) {
        letters = letters.replace(/[1lIoO0]/g, "");
      }
      if (this.options.ex_unwise) {
        letters = letters.replace(
          /[^abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\-_]/g,
          ""
        );
      }
      return letters;
    },
    getRnd: function (max) {
      return Math.floor((Math.random() * 999999) % max);
    },
    copyToClipboard: function () {
      navigator.clipboard.writeText(this.token_result).then(
        function () {
          /* clipboard successfully set */
          $(".copy-btn").height();
          $(".copy-btn").addClass("clicked");
          $(".copy-btn .popup-tooltip").html("Copied!");
          sto = setTimeout(() => {
            $(".copy-btn").removeClass("clicked");
            $(".copy-btn .popup-tooltip").html("Copy");
          }, 1000);
        },
        function () {}
      );
    },
    lengthMousedown: function (e) {
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
          this.saveOption("token_length");
        }
      });
    },
    saveOption: function (opt) {
      let val;
      if (opt === "token_length") {
        val = this.token_length;
      } else if (opt === "custom-letter") {
        val = this.letters.custom;
      } else {
        val = this.options[opt];
      }
      localStorage.setItem(`sm-option-${opt}`, val);
    },
    setScheme: function (s) {
      let scheme;
      if (s === "default") {
        this.settings.device_scheme =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
        scheme = this.settings.device_scheme;
      } else {
        scheme = this.settings.scheme;
      }
      $("html").attr("color-scheme", scheme);
      localStorage.setItem("sm-setting-scheme", s);
    },
    toggleVisibility: function () {
      this.visibility.state = !this.visibility.state;
      localStorage.setItem("sm-setting-visibility", this.visibility.state);
      $(".result-input-wrapper").removeClass("e");
    },
    activateTextarea: function (e) {
      console.log(e.target);
      e.target.classList.add("active");
    },

    clearTextarea: function () {
      localStorage.setItem("sm-option-custom-letter", "");
      this.letters.custom = "";
      $("textarea.active").focus();
    },
    doneTextarea: function () {
      $("textarea.active").removeClass("active");
    },
  },
  mounted: function () {
    for (o in this.options) {
      let val = localStorage.getItem(`sm-option-${o}`);
      if (val) {
        this.options[o] = val.toLowerCase() === "true";
      }
    }
    this.token_length =
      Math.floor(localStorage.getItem("sm-option-token_length")) || 15;
    this.letters.custom = localStorage.getItem("sm-option-custom-letter");
    this.settings.scheme =
      localStorage.getItem("sm-setting-scheme") || "default";
    this.setScheme(this.settings.scheme);

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        this.settings.device_scheme = event.matches ? "dark" : "light";
        this.setScheme(this.settings.device_scheme);
      });
  },
  computed: {
    token_length_validation: function () {
      let tl = this.token_length;
      if (tl <= 0) {
        this.token_length = 0;
      }
      if (tl >= 1) {
        this.token_length = tl.toString().replace(/^0*/, "");
      }
      if (this.token_length.toString().match(/\./)) {
        this.token_length = tl.toString().replace(/\./g, "");
      }
      if (this.token_length > 100000 || this.token_length <= 0) {
        return "invalid";
      } else {
        return "valid";
      }
    },
    input_type: function () {
      return this.visibility.state ? "text" : "password";
    },
  },
  watch: {
    settings: {
      handler: function () {
        this.setScheme(this.settings.scheme);
      },
      deep: true,
    },
  },
}).mount("#app");

$(".submit-btn,.copy-btn,.result-visibility-btn,textarea").click(function (e) {
  e.preventDefault();
});

$(".copy-btn").click(function () {});

$(".copy-btn").hover(function () {
  $(this).toggleClass("hover");
});

$(document).on("keydown", (e) => {
  if (e.originalEvent.code === "Escape") {
    $("details[open]").removeAttr("open");
  }
});
