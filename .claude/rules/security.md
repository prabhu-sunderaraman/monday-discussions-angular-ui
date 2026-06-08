* Angular is XSS-safe by default
* Use SafeHTMLPipe for cases where HTML rendering is needed
* Never use raw fetch(); 
* No PII in logs
* No sensitive data in URL params
* CSP in meta tag

### Some of the required HTTP headers 

### Content-Security-Policy
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self';

### X-Frame-Options
X-Frame-Options: DENY
Prevents clickjacking — page cannot be embedded in an iframe.

### X-Content-Type-Options
X-Content-Type-Options: nosniff
Prevents MIME type sniffing.

### Referrer-Policy
Referrer-Policy: strict-origin-when-cross-origin
Limits referrer information sent with requests.

### Permissions-Policy
Permissions-Policy: camera=(), microphone=(), geolocation=()
Disables browser features not used by this application.