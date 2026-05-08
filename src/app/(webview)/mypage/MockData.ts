// app/(webview)/mypage/MockData

// /api/v1/users/me
export const MOCK_USER_PROFILE = {
    "status": "SUCCESS",
    "code": "200",
    "message": null,
    "data": {
        "email": "dkan8720@gmail.com",
        "nickname": "변경테스트",
        "profileImageUrl": "/DODOLogo.png",
        "bio": "변경bio",
        "onboarded": true
    }
}

// /api/v1/mypage/statistics
export const MOCK_USER_STATISTICS = {
    "status": "SUCCESS",
    "code": "200",
    "message": null,
    "data": {
        "nestCount": 8,
        "commentCount": 5,
        "postcardCount": 0
    }
}

// /api/v1/mypage/nests
export const MOCK_USER_NESTS = {
    "status": "SUCCESS",
    "code": "200",
    "message": null,
    "data": {
        "content": [
            {
                "id": 18,
                "title": "comment test3",
                "content": "comment test3.",
                "thumbnailUrl": "/MockImage1.png",
                "createdAt": "2026-05-05T04:33:03.218871",
                "updatedAt": "2026-05-05T04:33:03.218871",
                "unlocked": true
            },
            {
                "id": 11,
                "title": "수정 테스트 ",
                "content": "수정 테스트 ",
                "thumbnailUrl": "/MockImage2.png",
                "createdAt": "2026-04-24T16:33:16.78935",
                "updatedAt": "2026-04-24T16:33:49.347081",
                "unlocked": true
            },
            {
                "id": 10,
                "title": "수정 테스트 ",
                "content": "수정 테스트 ",
                "thumbnailUrl": "/DODOLogo.png",
                "createdAt": "2026-04-21T17:44:51.108035",
                "updatedAt": "2026-04-21T17:52:11.435051",
                "unlocked": true
            },
            {
                "id": 5,
                "title": "Test",
                "content": "test",
                "thumbnailUrl": "/MockImage1.png",
                "createdAt": "2026-04-21T04:12:58.44246",
                "updatedAt": "2026-04-23T06:03:14.93119",
                "unlocked": true
            }
        ],
        "pageable": {
            "pageNumber": 0,
            "pageSize": 10,
            "sort": {
                "empty": false,
                "sorted": true,
                "unsorted": false
            },
            "offset": 0,
            "paged": true,
            "unpaged": false
        },
        "last": true,
        "totalElements": 4,
        "totalPages": 1,
        "first": true,
        "size": 10,
        "number": 0,
        "sort": {
            "empty": false,
            "sorted": true,
            "unsorted": false
        },
        "numberOfElements": 4,
        "empty": false
    }
}