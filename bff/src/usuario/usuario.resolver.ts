import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UsuarioOutput } from './usuario.output';
import { UsuarioInput } from './usuario.input';
import axios from 'axios';
import https from 'https';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => UsuarioOutput)
export class UsuarioResolver {
  @Query(() => [UsuarioOutput], { name: 'usuarios' })
  @UseGuards(JwtAuthGuard)
  async getUsuarios(@Context('req') req): Promise<UsuarioOutput[]> {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const response = await axios.get('https://localhost:7057/api/usuarios', {
      httpsAgent: agent,
      headers: { Authorization: req.headers.authorization },
    });
    return response.data;
  }

  @Query(() => UsuarioOutput, { name: 'usuario' })
  @UseGuards(JwtAuthGuard)
  async getUsuario(
    @Args('id', { type: () => Int }) id: number,
    @Context('req') req,
  ): Promise<UsuarioOutput> {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const response = await axios.get(
      `https://localhost:7057/api/usuarios/${id}`,
      {
        httpsAgent: agent,
        headers: { Authorization: req.headers.authorization },
      },
    );
    return response.data;
  }

  @Mutation(() => UsuarioOutput, { name: 'createUsuario' })
  async createUsuario(
    @Args('usuarioInput') usuarioInput: UsuarioInput,
  ): Promise<UsuarioOutput> {
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    const response = await axios.post(
      'https://localhost:7057/api/usuarios',
      usuarioInput,
      { httpsAgent },
    );

    console.log('Backend response:', response.data);

    // Extrair apenas os dados do usuário da resposta
    const userData = response.data.Usuario || response.data;
    console.log('User data to return:', userData);

    return userData;
  }

  @Mutation(() => UsuarioOutput, { name: 'updateUsuario' })
  @UseGuards(JwtAuthGuard)
  async updateUsuario(
    @Args('id', { type: () => Int }) id: number,
    @Args('usuarioInput') usuarioInput: UsuarioInput,
    @Context('req') req,
  ): Promise<UsuarioOutput> {
    const agent = new https.Agent({ rejectUnauthorized: false });
    try {
      const response = await axios.put(
        `https://localhost:7057/api/usuarios/${id}`,
        usuarioInput,
        {
          httpsAgent: agent,
          headers: { Authorization: req.headers.authorization },
        },
      );
      const data = response.data;
      // Se o PUT retornar objeto parcial ou vazio, buscar o recurso completo
      if (!data || data.id === null || data.id === undefined) {
        const getRes = await axios.get(
          `https://localhost:7057/api/usuarios/${id}`,
          {
            httpsAgent: agent,
            headers: { Authorization: req.headers.authorization },
          },
        );
        return getRes.data;
      }
      return data;
    } catch (error) {
      throw new Error(`Failed to update usuario: ${error.message}`);
    }
  }

  @Mutation(() => Boolean, { name: 'deleteUsuario' })
  @UseGuards(JwtAuthGuard)
  async deleteUsuario(
    @Args('id', { type: () => Int }) id: number,
    @Context('req') req,
  ): Promise<boolean> {
    const agent = new https.Agent({ rejectUnauthorized: false });
    await axios.delete(`https://localhost:7057/api/usuarios/${id}`, {
      httpsAgent: agent,
      headers: { Authorization: req.headers.authorization },
    });
    return true;
  }
}
