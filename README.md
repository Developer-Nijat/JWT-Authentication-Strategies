# Comparing JWT Authentication Strategies: HTTP-Only Cookies vs LocalStorage

This project demonstrates two different approaches to implementing JWT authentication in a MERN stack application. Let's analyze both implementations and their trade-offs.

## Version 1: HTTP-Only Cookies + Refresh Token

### Key Features:
1. **Secure Cookie Storage**
   - Access token stored in HTTP-Only cookies
   - Refresh token also stored in HTTP-Only cookies
   - Cookies are protected from JavaScript access
   - SameSite and secure flags implemented

2. **Backend Implementation**
   ```javascript
   // Cookie settings
   res.cookie("accessToken", accessToken, {
     httpOnly: true,
     secure: false,
     sameSite: "lax",
     maxAge: 15 * 60 * 1000, // 15 minutes
   });
   ```

3. **Frontend Configuration**
   - Axios configured with `withCredentials: true`
   - No manual token management needed
   - Automatic cookie handling

### Security Benefits:
- Protection against XSS attacks
- Tokens not accessible via JavaScript
- Automatic CSRF protection with SameSite attribute
- Secure token transmission

## Version 2: LocalStorage + Refresh Token

### Key Features:
1. **Client-Side Storage**
   - Access token stored in localStorage
   - Refresh token stored in localStorage
   - Manual token management required

2. **Backend Implementation**
   ```javascript
   // Token verification from Authorization header
   const authHeader = req.headers["authorization"];
   const token = authHeader && authHeader.split(" ")[1];
   ```

3. **Frontend Implementation**
   - Manual token storage and retrieval
   - Axios interceptors for token management
   - Automatic token refresh mechanism

### Implementation Details:
```javascript
// Token storage
localStorage.setItem("accessToken", accessToken);
localStorage.setItem("refreshToken", refreshToken);

// Axios interceptor for token refresh
instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token logic
    }
  }
);
```

## Comparison

### HTTP-Only Cookies (Version 1)
**Pros:**
- Better security against XSS attacks
- Automatic token handling
- No client-side token management needed
- Built-in CSRF protection

**Cons:**
- Requires proper CORS configuration
- Slightly more complex server setup
- Limited to same-origin requests by default

### LocalStorage (Version 2)
**Pros:**
- Simpler implementation
- Works across different domains easily
- More flexible token management
- Better for third-party integrations

**Cons:**
- Vulnerable to XSS attacks
- Manual token management required
- No built-in security features
- Tokens accessible via JavaScript

## Best Practices Implemented in Both Versions

1. **Token Expiration**
   - Access token: 15 minutes
   - Refresh token: 7 days

2. **Refresh Token Rotation**
   - Both versions implement refresh token mechanism
   - Automatic token refresh on expiration

3. **Secure Token Generation**
   ```javascript
   const ACCESS_SECRET = "YOUR_ACCESS_SECRET";
   const REFRESH_SECRET = "YOUR_REFRESH_SECRET";
   ```

4. **Token Verification**
   - Proper JWT verification on protected routes
   - Error handling for invalid tokens

## Recommendation

For most modern web applications, the HTTP-Only cookie approach (Version 1) is recommended due to its superior security features. However, the LocalStorage approach (Version 2) might be more suitable for:
- Cross-origin applications
- Third-party integrations
- Mobile applications
- Applications requiring more control over token management

## Security Considerations

1. **Always use HTTPS in production**
2. **Implement proper CORS policies**
3. **Use strong, unique secrets for token signing**
4. **Implement rate limiting for authentication endpoints**
5. **Consider implementing token blacklisting for logout**

This project provides a great foundation for understanding both approaches and can be used as a reference for implementing secure JWT authentication in your applications.
