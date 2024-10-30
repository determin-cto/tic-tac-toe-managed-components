
export default {
  async fetch(request, env, ctx) {
    const body = await request.json()
    const state = body.state;
    const emptySpotIndexes = state.flatMap((v, i) => v === 0 ? [i] : []);
    let nextRandomMove = emptySpotIndexes[Math.floor(Math.random() * emptySpotIndexes.length)];
    return Response.json({ index: nextRandomMove });
  },
};
