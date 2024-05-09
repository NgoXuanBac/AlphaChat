package com.alphachat.api.controller;

import com.alphachat.api.entity.RoleEntity;
import com.alphachat.api.payload.request.ForgotUserRequest;
import com.alphachat.api.payload.request.LoginRequest;
import com.alphachat.api.payload.request.ResetPasswordRequest;
import com.alphachat.api.payload.response.ResponseDTO;
import com.alphachat.api.payload.request.SignupRequest;
import com.alphachat.api.payload.TokenDTO;
import com.alphachat.api.security.JwtCookie;
import com.alphachat.api.security.JwtIssuer;
import com.alphachat.api.security.UserPrincipal;
import com.alphachat.api.service.EmailService;
import com.alphachat.api.service.RefreshTokenService;
import com.alphachat.api.service.UserService;
import com.alphachat.api.service.VerifyTokenService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/auth")
public class AuthController {
    private final JwtCookie jwtCookie;
    private final JwtIssuer jwtIssuer;
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;
    private final EmailService emailService;
    private final VerifyTokenService verifyTokenService;


    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest){
        try{
            var user =  userService.add(signupRequest);
            return ResponseEntity.ok().body(new ResponseDTO<>(true, "Sign up successfully!", user));
        }catch (Exception ex){
            return ResponseEntity.badRequest().body(new ResponseDTO<>(false, ex.getMessage(), ""));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest){
        try{
            var userProfile = userService.authenticate(loginRequest);
            var refreshToken = refreshTokenService.create(userProfile.getId()).getToken();
            var accessToken = jwtIssuer.issue(userProfile.getId(), userProfile.getEmail(), userProfile.getRoles());

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE,jwtCookie.generateJwtRefresh(refreshToken).toString())
                    .header(HttpHeaders.SET_COOKIE,jwtCookie.generateJwtAccess(accessToken).toString())
                    .body(new ResponseDTO<>(true, "Login successfully!", userProfile));

        }catch (Exception ex){
            return ResponseEntity.badRequest()
                    .body(new ResponseDTO<>(false, "Email or password is incorrect! ", ex.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody TokenDTO token) {

        if (userService.verify(token.getCode()) != null) {
            token.setVerified(true);
            return ResponseEntity.ok().body(new ResponseDTO<>(true,"Verify successful.", token));
        } else {
            return ResponseEntity.badRequest().body(new ResponseDTO<>(false,"Verify failed.", token));
        }
    }

    @PostMapping("/forgot")
    public ResponseEntity<?> forgotUser(@RequestBody ForgotUserRequest request) {
        try {
            var user = userService.getByEmail(request.getEmail());
            var verifyToken = verifyTokenService.generate(user);
            verifyToken.setUser(user);
            verifyTokenService.save(verifyToken);
            emailService.sendConfirmReset(request.getEmail(), verifyToken.getToken());
            return ResponseEntity.ok().body(new ResponseDTO<>(true,"Send verify successful", verifyToken.getToken()));
        }catch (Exception ex){
            return ResponseEntity.ok().body(new ResponseDTO<>(true,"Send verify failed", ""));
        }
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetUser(@RequestBody ResetPasswordRequest request) {
        var user = userService.verify(request.getCode());
        if (user!= null) {
            userService.updatePassword(user, request.getNewPassword());
            return ResponseEntity.ok().body(new ResponseDTO<>(true,"Update password successful.",""));
        } else {
            return ResponseEntity.badRequest().body(new ResponseDTO<>(false,"Link reset password is incorrect", ""));
        }
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@AuthenticationPrincipal UserPrincipal principal){
        if(principal!=null){
            refreshTokenService.deleteByUserId(principal.getUserId());
        }
        var jwtAccessCookie = jwtCookie.clearJwtAccess();
        var jwtRefreshCookie = jwtCookie.cleanJwtRefresh();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtAccessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, jwtRefreshCookie.toString())
                .body(new ResponseDTO<>(true, "Signed out successfully.", ""));
    }

    @PostMapping("/refresh")
    public  ResponseEntity<?> refreshToken(HttpServletRequest request){
        String refreshToken = jwtCookie.getJwtRefresh(request);
        if(refreshToken == null) return ResponseEntity.badRequest().body(
                new ResponseDTO<>(false, "Refresh token isn't existed in request.", "")
        );
        var token = refreshTokenService.findByToken(refreshToken);
        if(token.isEmpty()) return ResponseEntity.badRequest().body(
                new ResponseDTO<>(false, "Refresh token isn't existed in database.", "")
        );
        var validToken = refreshTokenService.verifyExpiration(token.get());
        if(validToken == null){
            return ResponseEntity.badRequest().body(
                    new ResponseDTO<>(false, "Refresh token was expired.  Please make a new sign in request", "")
            );
        }
        var user =  validToken.getUser();
        var roles = user.getRoles().stream().map(RoleEntity::getName).toList();
        String newAccessToken = jwtIssuer.issue(user.getId(),user.getEmail(), roles);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE,jwtCookie.generateJwtAccess(newAccessToken).toString())
                .body(new ResponseDTO<>(true, "Refresh toke successfully!","")
        );
    }

}
