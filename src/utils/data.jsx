export const sampleMovies = [
    {
        id: 1,
        movieName: "Mắt biếc",
        description: "Mắc Biếc: Một sự kết hợp tinh tế vẻ đẹp thuần khiết của văn chương Nguyễn Nhật Ánh, với những khung hình mãn nhãn đặc trưng của Victor Vũ, đã từng khiến khán giả choáng ngợp từ “Thiên mệnh anh hùng” tới “Tôi thấy hoa vàng trên cỏ xanh”.",
        category: "Chính kịch",
        duration: "116 min",
        releaseDate: "2019-12-18",
        earlyReleaseDate: "2019-12-15",
        country: "Việt Nam",
        director: "Victor Vũ",
        listActor: "Trần Nghĩa, Trúc Anh, Trần Phong",
        imageUrl: "https://innovavietnam.vn/wp-content/uploads/poster-561x800.jpg"
    },
    {
        id: 2,
        movieName: "Ngày Xưa Có Một Chuyện Tình",
        description: "Câu mở đầu trailer – lời dẫn chuyện của nhân vật Vinh là câu thoại nổi bật trong truyện: “Tình bạn là mảnh đất phù hợp nhất để tình yêu gieo xuống hạt giống của mình. Đến một lúc, ta sẽ nhận được phần thưởng quý giá nhất, đó chính là tình yêu”. Phim hứa hẹn bám sát nội dung truyện gốc, đúng với nhiệt huyết tuổi trẻ qua từng câu chữ mà nhà văn Nguyễn Nhật Ánh muốn thể hiện.",
        category: "Tình cảm",
        duration: "135 min",
        releaseDate: "2024-10-25",
        earlyReleaseDate: "2024-10-22",
        country: "Việt Name",
        director: "Trịnh Đình Lê Minh",
        listActor: "Avin Lu, Ngọc Xuân, Đỗ Nhật Hoàng, Thanh Tú, Bảo Tiên, Hạo Khang",
        imageUrl: "https://cdn.galaxycine.vn/media/2024/10/21/ngay-xua-co-1-chuyen-tinh-500_1729502959289.jpg"
    },
];

export const movieScreenings = [
    {
        branchId: 1,
        branch: "Branch A",
        address: "123 Main St, District 1, HCMC",
        listShowTime: [
            {
                id: 1,
                screenId: 1,
                screenName: "Screen 1",
                filmName: "Mắt biếc",
                startTime: "10:00",
                duration: "116 min",
                endTime: "11:56",
                emptySeat: 100,
                totalSeat: 100,
                date: '2024-10-27'
            },
            {
                id: 2,
                screenId: 2,
                screenName: "Screen 2",
                filmName: "Ngày Xưa Có Một Chuyện Tình",
                startTime: "13:00",
                duration: "135 min",
                endTime: "15:15",
                emptySeat: 100,
                totalSeat: 100,
                date: '2024-10-27'
            }
        ]
    },
    {
        branchId: 2,
        branch: "Branch B",
        address: "456 Central Park, District 3, HCMC",
        listShowTime: [
            {
                id: 3,
                screenId: 1,
                screenName: "Screen 1",
                filmName: "Mắt biếc",
                startTime: "09:30",
                duration: "116 min",
                endTime: "11:26",
                emptySeat: 120,
                totalSeat: 120,
                date: '2024-10-27'
            },
            {
                id: 4,
                screenId: 2,
                screenName: "Screen 2",
                filmName: "The Godfather",
                startTime: "14:00",
                duration: "175 min",
                endTime: "16:55",
                emptySeat: 120,
                totalSeat: 120,
                date: '2024-10-27'
            },
            {
                id: 5,
                screenId: 2,
                screenName: "Screen 2",
                filmName: "The Godfather",
                startTime: "17:00",
                duration: "175 min",
                endTime: "19:55",
                emptySeat: 120,
                totalSeat: 120,
                date: '2024-10-27'
            }
        ]
    },
    {
        branchId: 3,
        branch: "Branch C",
        address: "789 Cinema Blvd, District 7, HCMC",
        listShowTime: [
            {
                id: 6,
                screenId: 1,
                screenName: "Screen 1",
                filmName: "Inception",
                startTime: "12:00",
                duration: "148 min",
                endTime: "14:28",
                emptySeat: 90,
                totalSeat: 90,
                date: '2024-10-27'
            },
            {
                id: 7,
                screenId: 2,
                screenName: "Screen 2",
                filmName: "Ngày Xưa Có Một Chuyện Tình",
                startTime: "16:00",
                duration: "135 min",
                endTime: "18:15",
                emptySeat: 90,
                totalSeat: 90,
                date: '2024-10-27'
            }
        ]
    }
];

export const cinemaData = [
    {
        branch: "Branch A",
        address: "123 Main St, District 1, HCMC",
        listScreen: [
            {
                screenId: 1,
                screenName: "Screen 1",
                totalSeat: 100
            },
            {
                screenId: 2,
                screenName: "Screen 2",
                totalSeat: 120
            }
        ]
    },
    {
        branch: "Branch B",
        address: "456 Central Park, District 3, HCMC",
        listScreen: [
            {
                screenId: 3,
                screenName: "Screen 3",
                totalSeat: 90
            },
            {
                screenId: 4,
                screenName: "Screen 4",
                totalSeat: 150
            }
        ]
    },
    {
        branch: "Branch C",
        address: "789 Cinema Blvd, District 7, HCMC",
        listScreen: [
            {
                screenId: 5,
                screenName: "Screen 5",
                totalSeat: 80
            },
            {
                screenId: 6,
                screenName: "Screen 6",
                totalSeat: 110
            }
        ]
    }
];

export const dataBookingFilm = [
    {
        id: 1,
        title: 'Venom: Kèo Cuối',
        type: 'Khoa học, viễn tưởng',
        duration: 109,
        image: 'https://files.betacorp.vn/media%2fimages%2f2024%2f10%2f18%2f400x633%2D14%2D153720%2D181024%2D34.jpg',
        release_date: '2024-10-26',
        early_release_date: '2024-10-23'
    },
    {
        id: 2,
        title: 'Cô Dâu Hào Môn',
        type: 'Tâm lý',
        duration: 114,
        image: 'https://files.betacorp.vn/media%2fimages%2f2024%2f10%2f09%2fbeta%2D400x633%2D133538%2D091024%2D49.png',
        release_date: '2024-10-28',
        early_release_date: '2024-10-24'
    },
    {
        id: 3,
        title: 'Tee Yod: Quỷ Án Tạng Phần 2',
        type: 'Kinh dị',
        duration: 111,
        image: 'https://files.betacorp.vn/media%2fimages%2f2024%2f10%2f15%2f400wx633h%2D3%2D163518%2D151024%2D56.jpg',
        release_date: '2024-10-30',
        early_release_date: '2024-10-25'
    },
    {
        id: 4,
        title: 'Ngày Xưa Có Một Chuyện Tình',
        type: 'Tình cảm',
        duration: 135,
        image: 'https://files.betacorp.vn/media%2fimages%2f2024%2f10%2f23%2f011124%2Dsneak%2Dngay%2Dxua%2Dco%2Dmot%2Dchuyen%2Dtinh%2D135154%2D231024%2D14.png',
        release_date: '2024-11-01',
        early_release_date: '2024-10-27'
    },
    {
        id: 5,
        title: 'Robot Hoang Dã',
        type: 'Phiêu lưu, Hoạt hình',
        duration: 102,
        image: 'https://files.betacorp.vn/media%2fimages%2f2024%2f09%2f24%2fscreenshot%2D2024%2D09%2D24%2D133216%2D133325%2D240924%2D35.png',
        release_date: '2024-10-23',
        early_release_date: '2024-10-20'
    }
]

export const dataBookingModal = [
    {
        "show_time_id": 1,
        "film_id": 1,
        "branch": {
            "branch_id": 1,
            "branch_name": "Downtown Cinema"
        },
        "screen": {
            "screen_id": 1,
            "screen_name": "Screen A"
        },
        "start_time": "14:00",
        "duration": 120,
        "date": "2024-10-25",
        "is_active": true,
        "created_date": "2024-10-20"
    },
    {
        "show_time_id": 1,
        "film_id": 1,
        "branch": {
            "branch_id": 1,
            "branch_name": "Downtown Cinema"
        },
        "screen": {
            "screen_id": 1,
            "screen_name": "Screen A"
        },
        "start_time": "14:00",
        "duration": 120,
        "date": "2024-10-26",
        "is_active": true,
        "created_date": "2024-10-20"
    },
    {
        "show_time_id": 2,
        "film_id": 1,
        "branch": {
            "branch_id": 1,
            "branch_name": "Downtown Cinema"
        },
        "screen": {
            "screen_id": 2,
            "screen_name": "Screen B"
        },
        "start_time": "16:30",
        "duration": 150,
        "date": "2024-10-25",
        "is_active": true,
        "created_date": "2024-10-21"
    },
    {
        "show_time_id": 3,
        "film_id": 1,
        "branch": {
            "branch_id": 2,
            "branch_name": "Uptown Cinema"
        },
        "screen": {
            "screen_id": 3,
            "screen_name": "Screen C"
        },
        "start_time": "18:00",
        "duration": 140,
        "date": "2024-10-26",
        "is_active": false,
        "created_date": "2024-10-22"
    },
    {
        "show_time_id": 4,
        "film_id": 1,
        "branch": {
            "branch_id": 2,
            "branch_name": "Uptown Cinema"
        },
        "screen": {
            "screen_id": 4,
            "screen_name": "Screen D"
        },
        "start_time": "20:00",
        "duration": 130,
        "date": "2024-10-26",
        "is_active": true,
        "created_date": "2024-10-22"
    },
    {
        "show_time_id": 5,
        "film_id": 1,
        "branch": {
            "branch_id": 3,
            "branch_name": "Seaside Cinema"
        },
        "screen": {
            "screen_id": 5,
            "screen_name": "Screen E"
        },
        "start_time": "22:30",
        "duration": 110,
        "date": "2024-10-27",
        "is_active": true,
        "created_date": "2024-10-23"
    }
]

export const dataBookingSeat = [
    {
        "payment_id": "PMT123456",
        "user_id": "USR78910",
        "show_time_id": "ST56789",
        "list_seat": ["A1", "A2", "B5"],
        "total_price": 300000,
        "discount": 50000,
        "paid_amount": 250000,
        "is_active": true,
        "created_date": "2024-10-25T10:30:00Z"
    },
    {
        "payment_id": "PMT123457",
        "user_id": "USR78911",
        "show_time_id": "ST56790",
        "list_seat": ["C3", "C4", "D6"],
        "total_price": 450000,
        "discount": 75000,
        "paid_amount": 375000,
        "is_active": true,
        "created_date": "2024-10-25T12:00:00Z"
    },
    {
        "payment_id": "PMT123458",
        "user_id": "USR78912",
        "show_time_id": "ST56791",
        "list_seat": ["E7", "E8"],
        "total_price": 200000,
        "discount": 0,
        "paid_amount": 200000,
        "is_active": false,
        "created_date": "2024-10-24T18:45:00Z"
    },
    {
        "payment_id": "PMT123459",
        "user_id": "USR78913",
        "show_time_id": "ST56792",
        "list_seat": ["F9", "G10", "H11", "H12"],
        "total_price": 600000,
        "discount": 100000,
        "paid_amount": 500000,
        "is_active": true,
        "created_date": "2024-10-23T15:20:00Z"
    },
    {
        "payment_id": "PMT123460",
        "user_id": "USR78914",
        "show_time_id": "ST56793",
        "list_seat": ["J1", "J2", "J3"],
        "total_price": 350000,
        "discount": 50000,
        "paid_amount": 300000,
        "is_active": true,
        "created_date": "2024-10-22T09:10:00Z"
    }
]

export const voucher = [
    {
        "voucher_id": "VCH001",
        "voucher_name": "Discount 10%",
        "start_date": "2024-11-01",
        "end_date": "2024-11-30",
        "quantity": 100,
        "percent_discount": 10,
        "is_active": true,
        "created_date": "2024-10-25"
    },
    {
        "voucher_id": "VCH002",
        "voucher_name": "Black Friday Special",
        "start_date": "2024-11-25",
        "end_date": "2024-11-27",
        "quantity": 50,
        "percent_discount": 20,
        "is_active": true,
        "created_date": "2024-10-20"
    },
    {
        "voucher_id": "VCH003",
        "voucher_name": "Holiday Sale",
        "start_date": "2024-12-15",
        "end_date": "2024-12-31",
        "quantity": 200,
        "percent_discount": 15,
        "is_active": false,
        "created_date": "2024-09-10"
    },
    {
        "voucher_id": "VCH004",
        "voucher_name": "New Year Discount",
        "start_date": "2025-01-01",
        "end_date": "2025-01-10",
        "quantity": 300,
        "percent_discount": 25,
        "is_active": true,
        "created_date": "2024-10-22"
    },
    {
        "voucher_id": "VCH005",
        "voucher_name": "Summer Special",
        "start_date": "2024-06-01",
        "end_date": "2024-06-30",
        "quantity": 150,
        "percent_discount": 30,
        "is_active": false,
        "created_date": "2024-04-15"
    }
]