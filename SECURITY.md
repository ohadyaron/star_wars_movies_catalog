# Security Report

## Overview
This document describes known security vulnerabilities in development dependencies and their mitigations.

## Known Vulnerabilities (as of December 2024)

### Development Environment Only (Low Risk in Production)

#### 1. esbuild Development Server (Moderate Severity)
- **Issue**: esbuild <=0.24.2 - Development server can receive requests from any website
- **Advisory**: [GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99)
- **Impact**: Development only - NOT present in production builds
- **Mitigation**: Only run `npm start` on trusted local networks. Production builds are unaffected.

#### 2. tmp Package - Symbolic Link Vulnerability (Low Severity)
- **Issue**: tmp <=0.2.3 - Arbitrary file write via symbolic link
- **Advisory**: [GHSA-52f5-9888-hmc6](https://github.com/advisories/GHSA-52f5-9888-hmc6)
- **Impact**: Build-time only, used by Angular CLI
- **Mitigation**: Limited to CLI operations during development. Does not affect production builds.

### Angular Framework Vulnerabilities (Fixed in v19.2.16+)

#### 3. XSRF Token Leakage (High Severity)
- **Issue**: @angular/common <19.2.16 - XSRF Token Leakage via Protocol-Relative URLs
- **Advisory**: [GHSA-58c5-g7wp-6w37](https://github.com/advisories/GHSA-58c5-g7wp-6w37)
- **Impact**: Affects Angular HTTP Client when using protocol-relative URLs
- **Mitigation**: 
  - This application uses absolute URLs (https://swapi.info/api)
  - No protocol-relative URLs are used in the codebase
  - Upgrade to Angular 19.2.16+ when stable (v21 has breaking changes)

#### 4. Stored XSS via SVG (High Severity)
- **Issue**: @angular/compiler <=18.2.14 - XSS via SVG Animation, SVG URL, and MathML Attributes
- **Advisory**: [GHSA-v4hv-rgfq-gp49](https://github.com/advisories/GHSA-v4hv-rgfq-gp49)
- **Impact**: Affects applications rendering user-controlled SVG content
- **Mitigation**:
  - This application does NOT render SVG content from API or user input
  - All SVG/MathML content is static and controlled by developers
  - No user-generated content is rendered

## Upgrade Path

### Why Not Angular 21?
Angular 21 fixes all vulnerabilities but introduces breaking changes:
- `@angular/common/http` module structure changed
- Angular Material requires full rewrite for v21 compatibility
- TypeScript 5.9+ required (from 5.5)
- Multiple component API changes

### Recommended Action
Wait for Angular 19.2.16 LTS release or migrate to Angular 21 when:
1. Angular Material 21+ is stable
2. Migration guide is available
3. All breaking changes are documented

## Production Security

The production build is NOT affected by most of these vulnerabilities because:
- Development server (esbuild) is not used in production
- CLI tools (tmp) are not bundled in production
- Application does not use protocol-relative URLs
- Application does not render user-controlled SVG/MathML content

## Verification
To verify no user-controlled content rendering:
```bash
# Search for SVG rendering
grep -r "innerHTML" src/
grep -r "bypassSecurityTrust" src/
grep -r "<svg" src/

# Verify all API URLs are absolute
grep -r "http://" src/
grep -r "//" src/core/services/
```

## Report Date
Generated: December 18, 2024

## Next Review
Schedule next security audit when:
- Angular 19.2.16+ is released
- Any new CVEs are published
- Before deploying to production
