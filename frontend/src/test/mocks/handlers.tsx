import { http, HttpResponse } from 'msw'

export const handlers = []
// [
//   // GET /api/tasks
//   http.get('http://127.0.0.1:8000/api/tasks', () => {
//     return HttpResponse.json([
//       {
//         id: 1,
//         title: 'Test Task 1',
//         description: 'Test Description 1',
//         is_completed: false,
//         created_at: '2024-01-01T10:00:00Z'
//       },
//       {
//         id: 2,
//         title: 'Test Task 2',
//         description: null,
//         is_completed: false,
//         created_at: '2024-01-02T10:00:00Z'
//       }
//     ])
//   }),

//   // POST /api/tasks
//   http.post('http://127.0.0.1:8000/api/tasks', async ({ request }) => {
//     const body = await request.json() as any
//     return HttpResponse.json({
//       id: 3,
//       title: body.title,
//       description: body.description,
//       is_completed: false,
//       created_at: new Date().toISOString()
//     }, { status: 201 })
//   }),

//   // PUT /api/tasks/:id/complete
//   http.put('http://127.0.0.1:8000/api/tasks/:id/complete', ({ params }) => {
//     const { id } = params
//     return HttpResponse.json({
//       success: true,
//       message: 'Task marked as completed successfully.',
//       data: {
//         id: Number(id),
//         is_completed: true
//       }
//     })
//   })
// ]