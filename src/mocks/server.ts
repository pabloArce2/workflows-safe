// mocks/server.ts
import { rest, setupWorker } from "msw"

const server = setupWorker(
    rest.get("/api/task/:id", (req, res, ctx) => {
        return res(
            ctx.json({
                annotations: [
                    {
                        completed_by: 1,
                        created_ago: "5 minutes",
                        created_at: "2023-07-20T13:39:19.923025Z",
                        created_username: "m.gutierrez@sialitech.com, 1",
                        draft_created_at: null,
                        ground_truth: false,
                        id: 1,
                        last_action: null,
                        last_created_by: null,
                        lead_time: 5.443,
                        parent_annotation: null,
                        parent_prediction: null,
                        dataset: 1,
                        result: [
                            {
                                from_name: "label",
                                id: "XDKkak-FGp",
                                image_rotation: 0,
                                origin: "manual",
                                original_height: 2048,
                                original_width: 2880,
                                to_name: "image",
                                type: "rectanglelabels",
                                value: {
                                    height: 24.871176861702132,
                                    rectanglelabels: ["Airplane"],
                                    rotation: 0,
                                    width: 16.622340425531913,
                                    x: 7.9787234042553195,
                                    y: 37.77426861702127,
                                },
                            },
                            {
                                from_name: "label",
                                id: "mSvrwaY8ZE",
                                image_rotation: 0,
                                origin: "manual",
                                original_height: 2048,
                                original_width: 2880,
                                to_name: "image",
                                type: "rectanglelabels",
                                value: {
                                    height: 17.578125000000007,
                                    rectanglelabels: ["Car"],
                                    rotation: 0,
                                    width: 14.494680851063833,
                                    x: 45.34574468085106,
                                    y: 56.1003989361702,
                                },
                            },
                        ],
                        task: 1,
                        updated_at: "2023-07-20T13:39:19.923037Z",
                        updated_by: 1,
                        was_cancelled: false,
                    },
                ],
                annotations_ids: "1",
                annotations_results:
                    "[{id:XDKkak-FGp, type:rectanglelabels, value:{x:7.98, y:37.77, width:16.62, height:24.87, rotation:0, rectanglelabels:[Airplane]}, origin:manual, to_name:image, from_name:label, image_rotation:0, original_width:2880, original_height:2048},{id:mSvrwaY8ZE, type:rectanglelabels, value:{x:45.35, y:56.1, width:14.49, height:17.58, rotation:0, rectanglelabels:[Car]}, origin:manual, to_name:image, from_name:label, image_rotation:0, original_width",
                annotators: [1],
                avg_lead_time: 5.443,
                cancelled_annotations: 0,
                comment_authors: [],
                comment_count: 0,
                completed_at: "2023-07-20T13:39:19.923025Z",
                created_at: "2023-07-20T13:39:13.020900Z",
                data: {
                    image: "/example.png",
                },
                drafts: [],
                file_upload: "68de120b-rely-cloud_training.png",
                id: 1,
                inner_id: 1,
                is_labeled: true,
                last_comment_updated_at: null,
                meta: {},
                overlap: 1,
                predictions: [],
                predictions_model_versions: "",
                predictions_results: "",
                predictions_score: null,
                dataset: 1,
                storage_filename: null,
                total_annotations: 1,
                total_predictions: 0,
                unresolved_comment_count: 0,
                updated_at: "2023-07-20T13:39:19.964005Z",
                updated_by: [{ user_id: 1 }],
            })
        )
    }),

    rest.put("/api/path/:id", (req, res, ctx) => {
        return res(
            ctx.json({
                ...(req.body as object),
            })
        )
    })
)

export { server }
