/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/reservations/route";
exports.ids = ["app/api/reservations/route"];
exports.modules = {

/***/ "(rsc)/./app/api/reservations/route.js":
/*!***************************************!*\
  !*** ./app/api/reservations/route.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jsonwebtoken */ \"(rsc)/./node_modules/jsonwebtoken/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n/* harmony import */ var _app_lib_prisma__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/app/lib/prisma */ \"(rsc)/./app/lib/prisma.js\");\n// app/api/reservations/route.js\n\n\n\n\nconst JWT_SECRET = process.env.JWT_SECRET || 'user'; // Use .env in production\nasync function POST(request) {\n    try {\n        const token = (0,next_headers__WEBPACK_IMPORTED_MODULE_2__.cookies)().get('token')?.value;\n        if (!token) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: 'Not authenticated'\n            }, {\n                status: 401\n            });\n        }\n        const decoded = jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default().verify(token, JWT_SECRET);\n        const userId = decoded.id;\n        const { numberOfSeats } = await request.json();\n        // Validate input\n        if (!numberOfSeats) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: 'Number of seats is required'\n            }, {\n                status: 400\n            });\n        }\n        if (numberOfSeats < 1 || numberOfSeats > 7) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: 'You can only book 1 to 7 seats at a time'\n            }, {\n                status: 400\n            });\n        }\n        const availableSeats = await _app_lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].seat.findMany({\n            where: {\n                isBooked: false\n            },\n            orderBy: [\n                {\n                    rowNumber: 'asc'\n                },\n                {\n                    seatNumber: 'asc'\n                }\n            ]\n        });\n        if (availableSeats.length < numberOfSeats) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: `Not enough seats available. Only ${availableSeats.length} seats left.`\n            }, {\n                status: 400\n            });\n        }\n        const seatsByRow = availableSeats.reduce((acc, seat)=>{\n            if (!acc[seat.rowNumber]) {\n                acc[seat.rowNumber] = [];\n            }\n            acc[seat.rowNumber].push(seat);\n            return acc;\n        }, {});\n        let seatsToBook = [];\n        for(const rowNumber in seatsByRow){\n            if (seatsByRow[rowNumber].length >= numberOfSeats) {\n                seatsToBook = seatsByRow[rowNumber].slice(0, numberOfSeats);\n                break;\n            }\n        }\n        if (seatsToBook.length === 0) {\n            const sortedRows = Object.keys(seatsByRow).sort((a, b)=>seatsByRow[b].length - seatsByRow[a].length);\n            let remainingSeats = numberOfSeats;\n            seatsToBook = [];\n            for (const rowNumber of sortedRows){\n                const seatsFromRow = seatsByRow[rowNumber].slice(0, remainingSeats);\n                seatsToBook = [\n                    ...seatsToBook,\n                    ...seatsFromRow\n                ];\n                remainingSeats -= seatsFromRow.length;\n                if (remainingSeats <= 0) break;\n            }\n        }\n        const reservation = await _app_lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].reservation.create({\n            data: {\n                userId,\n                numberOfSeats\n            }\n        });\n        await Promise.all(seatsToBook.map((seat)=>_app_lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].seat.update({\n                where: {\n                    id: seat.id\n                },\n                data: {\n                    isBooked: true,\n                    reservationId: reservation.id\n                }\n            })));\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: 'Seats booked successfully',\n            reservation,\n            bookedSeats: seatsToBook\n        });\n    } catch (error) {\n        console.error('Error booking seats:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: 'Failed to book seats'\n        }, {\n            status: 500\n        });\n    }\n}\nasync function GET() {\n    try {\n        const token = (0,next_headers__WEBPACK_IMPORTED_MODULE_2__.cookies)().get('token')?.value;\n        if (!token) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: 'Not authenticated'\n            }, {\n                status: 401\n            });\n        }\n        const decoded = jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default().verify(token, JWT_SECRET);\n        const userId = decoded.id;\n        const reservations = await _app_lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].reservation.findMany({\n            where: {\n                userId\n            },\n            include: {\n                seats: true\n            },\n            orderBy: {\n                createdAt: 'desc'\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(reservations);\n    } catch (error) {\n        console.error('Error fetching reservations:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: 'Failed to fetch reservations'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1FBRUEsT0FBTzFELHFEQUFZQSxDQUFDWSxJQUFJLENBQUMyQztJQUMzQixFQUFFLE9BQU9ILE9BQU87UUFDZEMsUUFBUUQsS0FBSyxDQUFDLGdDQUFnQ0E7UUFDOUMsT0FBT3BELHFEQUFZQSxDQUFDWSxJQUFJLENBQ3RCO1lBQUVDLFNBQVM7UUFBK0IsR0FDMUM7WUFBRUMsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xca2VzYXJcXE9uZURyaXZlXFxEZXNrdG9wXFx6YXBwSGlyZSBBc3NpZ25tZW50XFx0aWNrZXQtYm9va2luZ1xcYXBwXFxhcGlcXHJlc2VydmF0aW9uc1xccm91dGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gYXBwL2FwaS9yZXNlcnZhdGlvbnMvcm91dGUuanNcclxuaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xyXG5pbXBvcnQgand0IGZyb20gJ2pzb253ZWJ0b2tlbic7XHJcbmltcG9ydCB7IGNvb2tpZXMgfSBmcm9tICduZXh0L2hlYWRlcnMnO1xyXG5pbXBvcnQgcHJpc21hIGZyb20gJ0AvYXBwL2xpYi9wcmlzbWEnO1xyXG5cclxuY29uc3QgSldUX1NFQ1JFVCA9IHByb2Nlc3MuZW52LkpXVF9TRUNSRVQgfHwgJ3VzZXInOyAvLyBVc2UgLmVudiBpbiBwcm9kdWN0aW9uXHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXF1ZXN0KSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHRva2VuID0gY29va2llcygpLmdldCgndG9rZW4nKT8udmFsdWU7XHJcbiAgICBcclxuICAgIGlmICghdG9rZW4pIHtcclxuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxyXG4gICAgICAgIHsgbWVzc2FnZTogJ05vdCBhdXRoZW50aWNhdGVkJyB9LFxyXG4gICAgICAgIHsgc3RhdHVzOiA0MDEgfVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjb25zdCBkZWNvZGVkID0gand0LnZlcmlmeSh0b2tlbiwgSldUX1NFQ1JFVCk7XHJcbiAgICBjb25zdCB1c2VySWQgPSBkZWNvZGVkLmlkO1xyXG4gICAgXHJcbiAgICBjb25zdCB7IG51bWJlck9mU2VhdHMgfSA9IGF3YWl0IHJlcXVlc3QuanNvbigpO1xyXG4gICAgXHJcbiAgICAvLyBWYWxpZGF0ZSBpbnB1dFxyXG4gICAgaWYgKCFudW1iZXJPZlNlYXRzKSB7XHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgICB7IG1lc3NhZ2U6ICdOdW1iZXIgb2Ygc2VhdHMgaXMgcmVxdWlyZWQnIH0sXHJcbiAgICAgICAgeyBzdGF0dXM6IDQwMCB9XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmIChudW1iZXJPZlNlYXRzIDwgMSB8fCBudW1iZXJPZlNlYXRzID4gNykge1xyXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXHJcbiAgICAgICAgeyBtZXNzYWdlOiAnWW91IGNhbiBvbmx5IGJvb2sgMSB0byA3IHNlYXRzIGF0IGEgdGltZScgfSxcclxuICAgICAgICB7IHN0YXR1czogNDAwIH1cclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uc3QgYXZhaWxhYmxlU2VhdHMgPSBhd2FpdCBwcmlzbWEuc2VhdC5maW5kTWFueSh7XHJcbiAgICAgIHdoZXJlOiB7IGlzQm9va2VkOiBmYWxzZSB9LFxyXG4gICAgICBvcmRlckJ5OiBbXHJcbiAgICAgICAgeyByb3dOdW1iZXI6ICdhc2MnIH0sXHJcbiAgICAgICAgeyBzZWF0TnVtYmVyOiAnYXNjJyB9LFxyXG4gICAgICBdLFxyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIGlmIChhdmFpbGFibGVTZWF0cy5sZW5ndGggPCBudW1iZXJPZlNlYXRzKSB7XHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgICB7IG1lc3NhZ2U6IGBOb3QgZW5vdWdoIHNlYXRzIGF2YWlsYWJsZS4gT25seSAke2F2YWlsYWJsZVNlYXRzLmxlbmd0aH0gc2VhdHMgbGVmdC5gIH0sXHJcbiAgICAgICAgeyBzdGF0dXM6IDQwMCB9XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNvbnN0IHNlYXRzQnlSb3cgPSBhdmFpbGFibGVTZWF0cy5yZWR1Y2UoKGFjYywgc2VhdCkgPT4ge1xyXG4gICAgICBpZiAoIWFjY1tzZWF0LnJvd051bWJlcl0pIHtcclxuICAgICAgICBhY2Nbc2VhdC5yb3dOdW1iZXJdID0gW107XHJcbiAgICAgIH1cclxuICAgICAgYWNjW3NlYXQucm93TnVtYmVyXS5wdXNoKHNlYXQpO1xyXG4gICAgICByZXR1cm4gYWNjO1xyXG4gICAgfSwge30pO1xyXG4gICAgXHJcbiAgICBsZXQgc2VhdHNUb0Jvb2sgPSBbXTtcclxuICAgIFxyXG4gICAgZm9yIChjb25zdCByb3dOdW1iZXIgaW4gc2VhdHNCeVJvdykge1xyXG4gICAgICBpZiAoc2VhdHNCeVJvd1tyb3dOdW1iZXJdLmxlbmd0aCA+PSBudW1iZXJPZlNlYXRzKSB7XHJcbiAgICAgICAgc2VhdHNUb0Jvb2sgPSBzZWF0c0J5Um93W3Jvd051bWJlcl0uc2xpY2UoMCwgbnVtYmVyT2ZTZWF0cyk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKHNlYXRzVG9Cb29rLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBjb25zdCBzb3J0ZWRSb3dzID0gT2JqZWN0LmtleXMoc2VhdHNCeVJvdykuc29ydChcclxuICAgICAgICAoYSwgYikgPT4gc2VhdHNCeVJvd1tiXS5sZW5ndGggLSBzZWF0c0J5Um93W2FdLmxlbmd0aFxyXG4gICAgICApO1xyXG4gICAgICBcclxuICAgICAgbGV0IHJlbWFpbmluZ1NlYXRzID0gbnVtYmVyT2ZTZWF0cztcclxuICAgICAgc2VhdHNUb0Jvb2sgPSBbXTtcclxuICAgICAgXHJcbiAgICAgIGZvciAoY29uc3Qgcm93TnVtYmVyIG9mIHNvcnRlZFJvd3MpIHtcclxuICAgICAgICBjb25zdCBzZWF0c0Zyb21Sb3cgPSBzZWF0c0J5Um93W3Jvd051bWJlcl0uc2xpY2UoMCwgcmVtYWluaW5nU2VhdHMpO1xyXG4gICAgICAgIHNlYXRzVG9Cb29rID0gWy4uLnNlYXRzVG9Cb29rLCAuLi5zZWF0c0Zyb21Sb3ddO1xyXG4gICAgICAgIHJlbWFpbmluZ1NlYXRzIC09IHNlYXRzRnJvbVJvdy5sZW5ndGg7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHJlbWFpbmluZ1NlYXRzIDw9IDApIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGNvbnN0IHJlc2VydmF0aW9uID0gYXdhaXQgcHJpc21hLnJlc2VydmF0aW9uLmNyZWF0ZSh7XHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICB1c2VySWQsXHJcbiAgICAgICAgbnVtYmVyT2ZTZWF0cyxcclxuICAgICAgfSxcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICBhd2FpdCBQcm9taXNlLmFsbChcclxuICAgICAgc2VhdHNUb0Jvb2subWFwKHNlYXQgPT5cclxuICAgICAgICBwcmlzbWEuc2VhdC51cGRhdGUoe1xyXG4gICAgICAgICAgd2hlcmU6IHsgaWQ6IHNlYXQuaWQgfSxcclxuICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgaXNCb29rZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHJlc2VydmF0aW9uSWQ6IHJlc2VydmF0aW9uLmlkLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9KVxyXG4gICAgICApXHJcbiAgICApO1xyXG4gICAgXHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBcclxuICAgICAgbWVzc2FnZTogJ1NlYXRzIGJvb2tlZCBzdWNjZXNzZnVsbHknLFxyXG4gICAgICByZXNlcnZhdGlvbixcclxuICAgICAgYm9va2VkU2VhdHM6IHNlYXRzVG9Cb29rXHJcbiAgICB9KTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgYm9va2luZyBzZWF0czonLCBlcnJvcik7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXHJcbiAgICAgIHsgbWVzc2FnZTogJ0ZhaWxlZCB0byBib29rIHNlYXRzJyB9LFxyXG4gICAgICB7IHN0YXR1czogNTAwIH1cclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKCkge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB0b2tlbiA9IGNvb2tpZXMoKS5nZXQoJ3Rva2VuJyk/LnZhbHVlO1xyXG4gICAgXHJcbiAgICBpZiAoIXRva2VuKSB7XHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgICB7IG1lc3NhZ2U6ICdOb3QgYXV0aGVudGljYXRlZCcgfSxcclxuICAgICAgICB7IHN0YXR1czogNDAxIH1cclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgY29uc3QgZGVjb2RlZCA9IGp3dC52ZXJpZnkodG9rZW4sIEpXVF9TRUNSRVQpO1xyXG4gICAgY29uc3QgdXNlcklkID0gZGVjb2RlZC5pZDtcclxuICAgIFxyXG4gICAgY29uc3QgcmVzZXJ2YXRpb25zID0gYXdhaXQgcHJpc21hLnJlc2VydmF0aW9uLmZpbmRNYW55KHtcclxuICAgICAgd2hlcmU6IHsgdXNlcklkIH0sXHJcbiAgICAgIGluY2x1ZGU6IHsgc2VhdHM6IHRydWUgfSxcclxuICAgICAgb3JkZXJCeTogeyBjcmVhdGVkQXQ6ICdkZXNjJyB9LFxyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihyZXNlcnZhdGlvbnMpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBmZXRjaGluZyByZXNlcnZhdGlvbnM6JywgZXJyb3IpO1xyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxyXG4gICAgICB7IG1lc3NhZ2U6ICdGYWlsZWQgdG8gZmV0Y2ggcmVzZXJ2YXRpb25zJyB9LFxyXG4gICAgICB7IHN0YXR1czogNTAwIH1cclxuICAgICk7XHJcbiAgfVxyXG59Il0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImp3dCIsImNvb2tpZXMiLCJwcmlzbWEiLCJKV1RfU0VDUkVUIiwicHJvY2VzcyIsImVudiIsIlBPU1QiLCJyZXF1ZXN0IiwidG9rZW4iLCJnZXQiLCJ2YWx1ZSIsImpzb24iLCJtZXNzYWdlIiwic3RhdHVzIiwiZGVjb2RlZCIsInZlcmlmeSIsInVzZXJJZCIsImlkIiwibnVtYmVyT2ZTZWF0cyIsImF2YWlsYWJsZVNlYXRzIiwic2VhdCIsImZpbmRNYW55Iiwid2hlcmUiLCJpc0Jvb2tlZCIsIm9yZGVyQnkiLCJyb3dOdW1iZXIiLCJzZWF0TnVtYmVyIiwibGVuZ3RoIiwic2VhdHNCeVJvdyIsInJlZHVjZSIsImFjYyIsInB1c2giLCJzZWF0c1RvQm9vayIsInNsaWNlIiwic29ydGVkUm93cyIsIk9iamVjdCIsImtleXMiLCJzb3J0IiwiYSIsImIiLCJyZW1haW5pbmdTZWF0cyIsInNlYXRzRnJvbVJvdyIsInJlc2VydmF0aW9uIiwiY3JlYXRlIiwiZGF0YSIsIlByb21pc2UiLCJhbGwiLCJtYXAiLCJ1cGRhdGUiLCJyZXNlcnZhdGlvbklkIiwiYm9va2VkU2VhdHMiLCJlcnJvciIsImNvbnNvbGUiLCJHRVQiLCJyZXNlcnZhdGlvbnMiLCJpbmNsdWRlIiwic2VhdHMiLCJjcmVhdGVkQXQiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/reservations/route.js\n");

/***/ }),

/***/ "(rsc)/./app/lib/prisma.js":
/*!***************************!*\
  !*** ./app/lib/prisma.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nlet prisma;\nif (!globalForPrisma.prisma) {\n    globalForPrisma.prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\n}\nprisma = globalForPrisma.prisma;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prisma);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvbGliL3ByaXNtYS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBOEM7QUFFOUMsTUFBTUMsa0JBQWtCQztBQUV4QixJQUFJQztBQUVKLElBQUksQ0FBQ0YsZ0JBQWdCRSxNQUFNLEVBQUU7SUFDM0JGLGdCQUFnQkUsTUFBTSxHQUFHLElBQUlILHdEQUFZQTtBQUMzQztBQUVBRyxTQUFTRixnQkFBZ0JFLE1BQU07QUFFL0IsaUVBQWVBLE1BQU1BLEVBQUMiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xca2VzYXJcXE9uZURyaXZlXFxEZXNrdG9wXFx6YXBwSGlyZSBBc3NpZ25tZW50XFx0aWNrZXQtYm9va2luZ1xcYXBwXFxsaWJcXHByaXNtYS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tICdAcHJpc21hL2NsaWVudCc7XHJcblxyXG5jb25zdCBnbG9iYWxGb3JQcmlzbWEgPSBnbG9iYWxUaGlzO1xyXG5cclxubGV0IHByaXNtYTtcclxuXHJcbmlmICghZ2xvYmFsRm9yUHJpc21hLnByaXNtYSkge1xyXG4gIGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPSBuZXcgUHJpc21hQ2xpZW50KCk7XHJcbn1cclxuXHJcbnByaXNtYSA9IGdsb2JhbEZvclByaXNtYS5wcmlzbWE7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBwcmlzbWE7Il0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsImdsb2JhbEZvclByaXNtYSIsImdsb2JhbFRoaXMiLCJwcmlzbWEiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/lib/prisma.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Freservations%2Froute&page=%2Fapi%2Freservations%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freservations%2Froute.js&appDir=C%3A%5CUsers%5Ckesar%5COneDrive%5CDesktop%5CzappHire%20Assignment%5Cticket-booking%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Ckesar%5COneDrive%5CDesktop%5CzappHire%20Assignment%5Cticket-booking&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Freservations%2Froute&page=%2Fapi%2Freservations%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freservations%2Froute.js&appDir=C%3A%5CUsers%5Ckesar%5COneDrive%5CDesktop%5CzappHire%20Assignment%5Cticket-booking%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Ckesar%5COneDrive%5CDesktop%5CzappHire%20Assignment%5Cticket-booking&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_kesar_OneDrive_Desktop_zappHire_Assignment_ticket_booking_app_api_reservations_route_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/reservations/route.js */ \"(rsc)/./app/api/reservations/route.js\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/reservations/route\",\n        pathname: \"/api/reservations\",\n        filename: \"route\",\n        bundlePath: \"app/api/reservations/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\kesar\\\\OneDrive\\\\Desktop\\\\zappHire Assignment\\\\ticket-booking\\\\app\\\\api\\\\reservations\\\\route.js\",\n    nextConfigOutput,\n    userland: C_Users_kesar_OneDrive_Desktop_zappHire_Assignment_ticket_booking_app_api_reservations_route_js__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZyZXNlcnZhdGlvbnMlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnJlc2VydmF0aW9ucyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnJlc2VydmF0aW9ucyUyRnJvdXRlLmpzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNrZXNhciU1Q09uZURyaXZlJTVDRGVza3RvcCU1Q3phcHBIaXJlJTIwQXNzaWdubWVudCU1Q3RpY2tldC1ib29raW5nJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1DJTNBJTVDVXNlcnMlNUNrZXNhciU1Q09uZURyaXZlJTVDRGVza3RvcCU1Q3phcHBIaXJlJTIwQXNzaWdubWVudCU1Q3RpY2tldC1ib29raW5nJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUMwRDtBQUN2STtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxca2VzYXJcXFxcT25lRHJpdmVcXFxcRGVza3RvcFxcXFx6YXBwSGlyZSBBc3NpZ25tZW50XFxcXHRpY2tldC1ib29raW5nXFxcXGFwcFxcXFxhcGlcXFxccmVzZXJ2YXRpb25zXFxcXHJvdXRlLmpzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9yZXNlcnZhdGlvbnMvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9yZXNlcnZhdGlvbnNcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3Jlc2VydmF0aW9ucy9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXGtlc2FyXFxcXE9uZURyaXZlXFxcXERlc2t0b3BcXFxcemFwcEhpcmUgQXNzaWdubWVudFxcXFx0aWNrZXQtYm9va2luZ1xcXFxhcHBcXFxcYXBpXFxcXHJlc2VydmF0aW9uc1xcXFxyb3V0ZS5qc1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Freservations%2Froute&page=%2Fapi%2Freservations%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freservations%2Froute.js&appDir=C%3A%5CUsers%5Ckesar%5COneDrive%5CDesktop%5CzappHire%20Assignment%5Cticket-booking%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Ckesar%5COneDrive%5CDesktop%5CzappHire%20Assignment%5Cticket-booking&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@prisma/client");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/ms","vendor-chunks/semver","vendor-chunks/jsonwebtoken","vendor-chunks/lodash.includes","vendor-chunks/jws","vendor-chunks/lodash.once","vendor-chunks/jwa","vendor-chunks/lodash.isinteger","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/lodash.isplainobject","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isboolean","vendor-chunks/safe-buffer","vendor-chunks/buffer-equal-constant-time"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Freservations%2Froute&page=%2Fapi%2Freservations%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freservations%2Froute.js&appDir=C%3A%5CUsers%5Ckesar%5COneDrive%5CDesktop%5CzappHire%20Assignment%5Cticket-booking%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Ckesar%5COneDrive%5CDesktop%5CzappHire%20Assignment%5Cticket-booking&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();