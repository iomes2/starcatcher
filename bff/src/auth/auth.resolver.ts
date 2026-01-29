import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthInput } from './auth.input';
import { AuthOutput } from './auth.output';
import axios from 'axios';
import https from 'https';

@Resolver()
export class AuthResolver {
  @Mutation(() => AuthOutput)
  async login(@Args('authInput') authInput: AuthInput): Promise<AuthOutput> {
    const agent = new https.Agent({ rejectUnauthorized: false });
    try {
      const response = await axios.post(
        'https://localhost:7057/api/auth/login',
        { nome: authInput.nome, senha: authInput.senha },
        { httpsAgent: agent },
      );
      return { token: response.data.token };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }
}
