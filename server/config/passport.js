const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google OAuth profile:', profile);
        
        // Check if user already exists with this email
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // User exists - check if they have Google ID
          if (!user.googleId) {
            // Link Google account to existing email account
            user.googleId = profile.id;
            user.isEmailVerified = true;
            user.profilePicture = profile.photos?.[0]?.value;
            await user.save();
          }
          return done(null, user);
        }

        // Create new user with Google OAuth
        const usernameBase = profile.displayName.replace(/\s+/g, '').toLowerCase();
        let username = usernameBase;
        let counter = 1;

        // Generate unique username
        while (await User.findOne({ userName: username })) {
          username = `${usernameBase}${counter}`;
          counter++;
        }

        user = new User({
          googleId: profile.id,
          userName: username,
          email: profile.emails[0].value,
          firstName: profile.name?.givenName || '',
          lastName: profile.name?.familyName || '',
          profilePicture: profile.photos?.[0]?.value,
          isEmailVerified: true, // Google emails are verified
          password: undefined, // No password for OAuth users
        });

        await user.save();
        console.log('New Google OAuth user created:', user.email);
        return done(null, user);
      } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
      }
    }
  )
);

// Simple serialize/deserialize for Passport
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;