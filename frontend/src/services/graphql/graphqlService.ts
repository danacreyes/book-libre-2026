import type { BookConversion } from "@/domain/graphql/BookConversion"
import type { BookTypeCalification } from "@/domain/graphql/BookTypeCalification"
import type { ActivityEvent } from "@/domain/graphql/ActivityEvent"
import axios from "axios"

export type GraphQLResponse<T> = {
  data: T
  errors?: { message: string }[] // GraphQL puede mandar errores en HTTP 200
}

class GraphQLService {
  async getConversionRate(): Promise<BookConversion[]> {
    const response = await axios.post<
      GraphQLResponse<{ conversionRate: BookConversion[] }>
    >(import.meta.env.VITE_API_URL + `/graphql`, {
      query: `
						query {
								conversionRate {
								bookId
								title
								clicks
								reservations
								conversionRate
								}
						}
						`,
    })

    if (response.data.errors) {
      throw new Error(
        "Error en consulta GraphQL: " +
          response.data.errors.map((e) => e.message).join(", "),
      )
    }
    return response.data.data.conversionRate
  }

  async getCalificationAnalisis(): Promise<BookTypeCalification[]> {
    const response = await axios.post<
      GraphQLResponse<{ calificactionAnalisis: BookTypeCalification[] }>
    >(import.meta.env.VITE_API_URL + `/graphql`, {
      query: `{ calificactionAnalisis { bookType avgRating } }`,
    })
    if (response.data.errors) {
      throw new Error(
        "Error en consulta GraphQL: " +
          response.data.errors.map((e) => e.message).join(", "),
      )
    }
    return response.data.data.calificactionAnalisis
  }

  async getRecentActivity(): Promise<ActivityEvent[]> {
    const response = await axios.post<
      GraphQLResponse<{ recentActivity: ActivityEvent[] }>
    >(import.meta.env.VITE_API_URL + `/graphql`, {
      query: `
          query { recentActivity { __typename date typeEvent user bookTitle } }
        `,
    })
    if (response.data.errors) {
      throw new Error(
        "Error en consulta GraphQL: " +
          response.data.errors.map((e) => e.message).join(", "),
      )
    }
    return response.data.data.recentActivity
  }
}

export const graphqlService = new GraphQLService()

// {
//     "query":
//         "{ conversionRate { bookId title clicks reservations conversionRate } }"
// }
