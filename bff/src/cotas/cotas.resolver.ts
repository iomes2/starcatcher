import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { CotaInput } from './cota.input';
import { UpdateCotaInput } from './update-cota.input';
import { CotaOutput } from './cota.output';
import axios, { AxiosError } from 'axios';
import https from 'https';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => CotaOutput)
@UseGuards(JwtAuthGuard)
export class CotasResolver {
  @Query(() => [CotaOutput], { name: 'cotas' })
  async getCotas(@Context('req') req): Promise<CotaOutput[]> {
    const agent = new https.Agent({ rejectUnauthorized: false });
    try {
      const response = await axios.get('https://localhost:7057/api/cotas', {
        httpsAgent: agent,
        headers: { Authorization: req.headers.authorization },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch cotas: ${error.message}`);
    }
  }

  @Mutation(() => CotaOutput, { name: 'createCota' })
  async createCota(
    @Args('cotaInput') cotaInput: CotaInput,
    @Context('req') req,
  ): Promise<CotaOutput> {
    const agent = new https.Agent({ rejectUnauthorized: false });
    try {
      const response = await axios.post(
        'https://localhost:7057/api/cotas',
        cotaInput,
        {
          httpsAgent: agent,
          headers: { Authorization: req.headers.authorization },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create cota: ${error.message}`);
    }
  }

  @Mutation(() => CotaOutput, { name: 'updateCota' })
  async updateCota(
    @Args('id', { type: () => Int }) id: number,
    @Args('cotaInput') cotaInput: UpdateCotaInput,
    @Context('req') req,
  ): Promise<CotaOutput> {
    const agent = new https.Agent({ rejectUnauthorized: false });
    try {
      const response = await axios.put(
        `https://localhost:7057/api/cotas/${id}`,
        cotaInput,
        {
          httpsAgent: agent,
          headers: { Authorization: req.headers.authorization },
        },
      );
      const data = response.data;
      if (!data || data.numeroCota === null || data.numeroCota === undefined) {
        const getRes = await axios.get(
          `https://localhost:7057/api/cotas/${id}`,
          {
            httpsAgent: agent,
            headers: { Authorization: req.headers.authorization },
          },
        );
        return getRes.data;
      }
      return data;
    } catch (error) {
      throw new Error(`Failed to update cota: ${error.message}`);
    }
  }

  @Mutation(() => Boolean, { name: 'deleteCota' })
  async deleteCota(
    @Args('id', { type: () => Int }) id: number,
    @Context('req') req,
  ): Promise<boolean> {
    const agent = new https.Agent({ rejectUnauthorized: false });
    try {
      await axios.delete(`https://localhost:7057/api/cotas/${id}`, {
        httpsAgent: agent,
        headers: { Authorization: req.headers.authorization },
      });
      return true;
    } catch (error) {
      throw new Error(`Failed to delete cota: ${error.message}`);
    }
  }

  @Query(() => CotaOutput, { name: 'cota' })
  async getCota(
    @Args('id', { type: () => Int }) id: number,
    @Context('req') req,
  ): Promise<CotaOutput> {
    const agent = new https.Agent({ rejectUnauthorized: false });
    try {
      const response = await axios.get(
        `https://localhost:7057/api/cotas/${id}`,
        {
          httpsAgent: agent,
          headers: { Authorization: req.headers.authorization },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch cota: ${error.message}`);
    }
  }

  @Query(() => [CotaOutput], { name: 'cotasByConsorcioId' })
  async getCotasByConsorcioId(
    @Args('consorcioId', { type: () => Int }) consorcioId: number,
    @Context('req') req,
  ): Promise<CotaOutput[]> {
    const agent = new https.Agent({ rejectUnauthorized: false });
    try {
      const response = await axios.get(
        `https://localhost:7057/api/cotas/consorcio/${consorcioId}`,
        {
          httpsAgent: agent,
          headers: { Authorization: req.headers.authorization },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch cotas by consorcio: ${error.message}`);
    }
  }

  @Query(() => [CotaOutput], { name: 'cotasByStatus' })
  async getCotasByStatus(
    @Args('status') status: string,
    @Context('req') req,
  ): Promise<CotaOutput[]> {
    const agent = new https.Agent({ rejectUnauthorized: false });
    try {
      const response = await axios.get(
        `https://localhost:7057/api/cotas/status/${status}`,
        {
          httpsAgent: agent,
          headers: { Authorization: req.headers.authorization },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch cotas by status: ${error.message}`);
    }
  }
}
