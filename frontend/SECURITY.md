# Security Best Practices for Frontend

## Overview

This document outlines security measures implemented to protect against vulnerabilities like CVE-2024-39338 (SSRF in axios) and other security threats.

## Implemented Security Measures

### 1. Secure Axios Configuration

- **Location**: `src/config/axiosConfig.js`
- **Features**:
  - URL validation to prevent SSRF attacks
  - HTTPS enforcement in production
  - Trusted domain whitelist
  - Error sanitization to prevent information leakage
  - CSRF token support
  - Request/response interceptors for security

### 2. URL Validation

Only requests to these trusted domains are allowed:

- `chtv2-bn.onrender.com`
- `localhost` (development only)
- `127.0.0.1` (development only)

### 3. Error Handling

- Sanitized error messages prevent information leakage
- No stack traces exposed to users
- Generic error messages for unknown errors

### 4. HTTPS Enforcement

- Automatic HTTP → HTTPS blocking in production
- Secure headers configuration
- CSRF protection

## Usage

### Import the Secure Axios Instance

```javascript
import axios from "../../config/axiosConfig";
```

### Making Secure API Calls

```javascript
// Standard axios usage (now with security)
const response = await axios.post(url, data, config);

// Or use the helper
import { secureApiCall } from "../../config/axiosConfig";
const response = await secureApiCall("POST", url, data, config);
```

## Dependency Security

### Regular Security Audits

Run these commands regularly:

```bash
# Check for vulnerabilities
npm audit

# Fix automatically fixable issues
npm audit fix

# Fix with package updates
npm audit fix --force

# Check specific package
npm audit axios
```

### Keeping Dependencies Updated

```bash
# Check outdated packages
npm outdated

# Update all dependencies (carefully)
npm update

# Update specific package
npm install axios@latest
```

## Ongoing Security Practices

### 1. Monthly Security Audit

```bash
cd CHT_V2/frontend
npm audit
```

### 2. Dependency Updates

- Review `npm audit` results monthly
- Update patches within 24 hours
- Review minor updates monthly
- Plan major updates quarterly

### 3. Code Review Checklist

- [ ] No raw axios imports (use secure config)
- [ ] No hardcoded URLs (use environment variables)
- [ ] All user inputs validated
- [ ] Error messages don't leak sensitive info
- [ ] HTTPS enforced

### 4. Environment Variables

Store sensitive data in `.env` files:

```bash
# .env
VITE_API_URL=https://chtv2-bn.onrender.com
VITE_CSRF_TOKEN=...
```

### 5. Production Deployment Checklist

- [ ] Run `npm audit` with no critical issues
- [ ] All dependencies updated
- [ ] HTTPS enforced
- [ ] No console logs in production
- [ ] Error tracking configured
- [ ] Rate limiting considered

## Known Vulnerabilities Handling

### CVE-2024-39338 (SSRF in axios)

**Status**: ✅ RESOLVED

- Upgraded to axios >= 1.7.4
- Added URL validation
- Configured trusted domain whitelist
- Added request interceptor validation

### How to Check

```bash
npm audit | grep CVE-2024-39338
# Should return nothing if fixed
```

## Security Contacts

- Report security issues immediately
- Do not create public GitHub issues for security vulnerabilities
- Contact: [Your security team]

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Axios Security](https://axios-http.com/docs/intro)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)
