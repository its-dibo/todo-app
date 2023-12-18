import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // extracts a Bearer token from the 'Authorization' header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // deny expired JWT
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('keys.privateKey') ||
        configService.get<string>('keys.publicKey'),
    });
  }

  /**
   * after passport verifies the JWT, it calls this function to inject the returned value into
   * the req.user
   * you can modify the payload before passport adding it to req.user
   * @param payload
   * @returns
   */
  validate(payload: any) {
    return payload;
  }
}
