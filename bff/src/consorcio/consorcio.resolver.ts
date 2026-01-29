import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ConsorcioOutput } from './consorcio.output';
import { ConsorcioInput } from './consorcio.input';
import { UpdateConsorcioInput } from './update-consorcio.input';
import axios from 'axios';
import https from 'https';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => ConsorcioOutput)
@UseGuards(JwtAuthGuard)
export class ConsorcioResolver {
  @Query(() => [ConsorcioOutput], { name: 'consorcios' })
  async getConsorcios(@Context('req') req): Promise<ConsorcioOutput[]> {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const response = await axios.get('https://localhost:7057/api/consorcios', {
      httpsAgent: agent,
      headers: { Authorization: req.headers.authorization },
    });
    return response.data;
  }

  @Query(() => ConsorcioOutput, { name: 'consorcio' })
  async getConsorcio(
    @Args('id', { type: () => Int }) id: number,
    @Context('req') req,
  ): Promise<ConsorcioOutput> {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const response = await axios.get(
      `https://localhost:7057/api/consorcios/${id}`,
      {
        httpsAgent: agent,
        headers: { Authorization: req.headers.authorization },
      },
    );
    return response.data;
  }

  @Mutation(() => ConsorcioOutput, { name: 'createConsorcio' })
  async createConsorcio(
    @Args('consorcioInput') consorcioInput: ConsorcioInput,
    @Context('req') req,
  ): Promise<ConsorcioOutput> {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const response = await axios.post(
      'https://localhost:7057/api/consorcios',
      consorcioInput,
      {
        httpsAgent: agent,
        headers: { Authorization: req.headers.authorization },
      },
    );
    return response.data;
  }

  @Mutation(() => ConsorcioOutput, { name: 'updateConsorcio' })
  async updateConsorcio(
    @Args('id', { type: () => Int }) id: number,
    @Args('consorcioInput') consorcioInput: UpdateConsorcioInput,
    @Context('req') req,
  ): Promise<ConsorcioOutput> {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const response = await axios.put(
      `https://localhost:7057/api/consorcios/${id}`,
      consorcioInput,
      {
        httpsAgent: agent,
        headers: { Authorization: req.headers.authorization },
      },
    );

    // Some backends return partial/empty body on PUT (or 204). If the response
    // doesn't include the id (non-nullable), fetch the full resource with GET.
    const updated = response.data;
    if (!updated || updated.id === undefined || updated.id === null) {
      const getResponse = await axios.get(
        `https://localhost:7057/api/consorcios/${id}`,
        {
          httpsAgent: agent,
          headers: { Authorization: req.headers.authorization },
        },
      );
      return getResponse.data;
    }

    return updated;
  }

  @Mutation(() => Boolean, { name: 'deleteConsorcio' })
  async deleteConsorcio(
    @Args('id', { type: () => Int }) id: number,
    @Context('req') req,
  ): Promise<boolean> {
    const agent = new https.Agent({ rejectUnauthorized: false });
    await axios.delete(`https://localhost:7057/api/consorcios/${id}`, {
      httpsAgent: agent,
      headers: { Authorization: req.headers.authorization },
    });
    return true;
  }
}
