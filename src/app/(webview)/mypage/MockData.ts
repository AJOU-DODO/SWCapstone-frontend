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
                "content": "수정 테스트 수정 테스트 수정 테스트 수정 테스트 수정 테스트 수정 테스트 수정 테스트 수정 테스트 수정 테스트 수정 테스트 수정 테스트수정 테스트 ",
                "thumbnailUrl": "/DODOLogo.png",
                "createdAt": "2026-04-21T17:44:51.108035",
                "updatedAt": "2026-04-21T17:52:11.435051",
                "unlocked": true
            },
            {
                "id": 5,
                "title": "Test",
                "content": "피카츄라이츄파이리꼬부기버터플야도란피죤투또가스서로생긴모습은달라도우리는모두친구맞아산에서들에서때리고뒹굴고사막에서정글에서울다가웃다가서로만나기까지힘들었어도우리는모두친구피카피카울랄랄라내가원하는건너도원하고마주잡은두손에맹세해힘을내봐그래힘을내봐용기를내봐그래용기를내봐피카피카피카츄피카피카피카츄너와나꿈을위해피카피카피카츄피카피카피카츄우리모두꿈을위해피카츄라이츄파이리꼬부기잠만보리자몽질퍽이탕구리서로가진생각은달라도우리는모두친구맞아재밌는얘기도신나는놀이도짜증나고싫증나고울고싶을때도서로나누어주고위로해주는우리는모두친구피카피카울랄랄라내가원하는걸너도원하고마주잡은두손에맹세해힘을내봐그래힘을재봐용기를내봐그래용기를내봐",
                "thumbnailUrl": null,
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