import type { BookConversion } from "@/domain/graphql/BookConversion";
import type { BookTypeCalification } from "@/domain/graphql/BookTypeCalification";
import type { CatalogHealth } from "@/domain/graphql/CatalogHealth";
import axios from "axios";

 export type GraphQLResponse<T> = {
      data: T
      errors?: { message: string }[]   // GraphQL puede mandar errores en HTTP 200
  }

class GraphQLService {


	async getConversionRate(): Promise<BookConversion[]> {
		const response = await
			axios.post<GraphQLResponse<{ conversionRate: BookConversion[]}>>(import.meta.env.VITE_API_URL + `/graphql`,
				{
					query:  `
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
				}
			)

		if(response.data.errors) {
			throw new Error("Error en consulta GraphQL: " 
				+ response.data.errors.map(e => e.message).join(", "))
		}
		return response.data.data.conversionRate
	}

	 async getCalificationAnalisis(): Promise<BookTypeCalification[]> {
      const response = await axios.post<GraphQLResponse<{ calificactionAnalisis: BookTypeCalification[] }>>(
          import.meta.env.VITE_API_URL + `/graphql`,
          {
              query: `{ calificactionAnalisis { bookType avgRating } }`
          }
      )
      if (response.data.errors) {
          throw new Error("Error en consulta GraphQL: "
              + response.data.errors.map(e => e.message).join(", "))
      }
      return response.data.data.calificactionAnalisis
  }

	async getCatalogHealth(): Promise<CatalogHealth> {
		const response = await axios.post<GraphQLResponse<{ catalogHealth: CatalogHealth }>>(
			import.meta.env.VITE_API_URL + `/graphql`,
			{
				query: `
					query {
						catalogHealth {
							total
							prestados
							disponiblesNuncaReservados
							disponiblesReservadosAFuturo
							disponiblesDevueltos
						}
					}
					`,
			}
		)
		if (response.data.errors) {
			throw new Error("Error en consulta GraphQL: "
				+ response.data.errors.map(e => e.message).join(", "))
		}
		return response.data.data.catalogHealth
	}

}

export const graphqlService = new GraphQLService()

// {
//     "query": 
//         "{ conversionRate { bookId title clicks reservations conversionRate } }"
// }