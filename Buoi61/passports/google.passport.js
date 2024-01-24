const { User, Provider } = require("../models/index");

const GoogleStrategy = require("passport-google-oauth20");
module.exports = new GoogleStrategy(
  {
    clientID:
      "194272781561-5gvfq9f7r3vd6tsfidm1253jl7ijsreo.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "https://buoi61.vercel.app/auth/google/callback",
    scope: ["profile", "email"],
    state: true,
  },
  async (accessToken, refreshToken, profile, cb) => {
    const {
      displayName: name,
      emails: [{ value: email }],
    } = profile;

    // Kiểm tra provider
    // Nếu tồn tại --> Lấy provider cũ
    // Nếu ko tồn tại --> Thêm mới provider
    const provider = await Provider.findOrCreate({
      where: { name: "google" },
      defaults: {
        name: "google",
      },
    });
    //Kiểm tra user
    // - Nếu tồn tại --> Lấy user cũ
    // - Nếu ko tồn tại --> Thêm user mới
    const user = await User.findOrCreate({
      where: { email, provider_id: provider[0].id },
      defaults: {
        name: name,
        email: email,
        status: true,
        provider_id: provider[0].id,
      },
    });
    if (user) {
      return cb(null, user[0]);
    }
    cb(null, {});
  }
);
