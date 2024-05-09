package com.alphachat.api.security;

import com.alphachat.api.constant.Constant;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;


@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(Constant.ALLOWED_ORIGIN));
        configuration.setAllowedMethods(List.of("*"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration(Constant.API_URL, configuration);
        return source;
    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
                                           JwtAuthenticationFilter jwtAuthenticationFilter,
                                           UnauthorizedHandle unauthorizedHandle) throws Exception{
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        http
                .cors(c->c.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sm->sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .formLogin(AbstractHttpConfigurer::disable)
                .exceptionHandling(ex->ex.authenticationEntryPoint(unauthorizedHandle))
                .securityMatcher(Constant.API_URL)
                .authorizeHttpRequests(
                        (auth)->auth
                                .requestMatchers(Constant.UNSECURED_URLS).permitAll()
                                .requestMatchers("/api/admin/**").hasAuthority(Constant.ROLE_ADMIN)
                                .anyRequest().authenticated()
                );

        return http.build();
    }
    @Bean
    public AuthenticationManager authenticationManager(
            HttpSecurity http, CustomUserDetailService userDetailService) throws Exception {
             var authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
             authenticationManagerBuilder
                     .userDetailsService(userDetailService)
                     .passwordEncoder(passwordEncoder());
            return authenticationManagerBuilder.build();

    }

}
