import { gql } from 'apollo-server';

export const typeDefs = gql`
    type Candidate {
    id: Int!
    fullName: String!
    email: String!
    }

    type Reports {
    candidatesPerCourse: [[String!]!]!
    overbookedCandidates: [Candidate!]!
    unchosenCandidates: [Candidate!]!
    }

    type Query {
    reports: Reports!
    }
`;
