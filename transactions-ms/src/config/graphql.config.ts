import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

export const graphqlConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  debug: true,
  typePaths: ['./**/*.gql'],
  buildSchemaOptions: {
    dateScalarMode: 'timestamp',
  },
};
