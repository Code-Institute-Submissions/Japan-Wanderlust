import os
import re

import jwt
from flask import request, jsonify
from psycopg2._psycopg import IntegrityError

from database import Database
from errors import response_500, response_401, response_400

# gets the value for our secret key which we will use for jwt
SECRET_KEY = os.environ.get('SECRET_KEY')



def register():
    """

    @api {POST} /api/v1/users/ User registration
        @apiVersion 1.0.0

        @apiName PostUsers
        @apiGroup Authentication

        @apiParam {String{2..25}="\w"} username User's username.
        @apiParam {String{1..25}="[a-zA-Z]"} firstname User's first name.
        @apiParam {String{1..25}="[a-zA-Z]"} lastname User's last name.
        @apiParam {String{8..}} password User's password.
        @apiParam {String} email User's email.

        @apiSuccessExample {json} Success-Response:
        {}

        @apiError (Bad Request 400) {Object} InvalidPassword        Password should have at least 8 characters and can contain any char except white space.
        @apiError (Bad Request 400) {Object} InvalidFirstname       Firstname should have at least 1 character and maximum 25, it can contain any capital or small letter.
        @apiError (Bad Request 400) {Object} InvalidLastname        Lastname should have at least 1 character and maximum 25, it can contain any capital or small letter.
        @apiError (Bad Request 400) {Object} InvalidUsername        Ussername should have at least 2 characters and maximum 25, it can contain any char except white space.
        @apiError (Bad Request 400) {Object} UnavailableUsername    Username is unavailable.
        @apiError (Bad Request 400) {Object} InvalidEmailFormat     Email should have an "@" sign and a email domain name with a domain ending of at least 2 characters.
        @apiError (InternalServerError 500) {Object} InternalServerError

    """

    try:
        # tries to get the value if none provided returns an emtpy string
        username = request.json.get('username', '')
        firstname = request.json.get('firstname', '')
        lastname = request.json.get('lastname', '')
        password = request.json.get('password', '')
        email = request.json.get('email', '')

        if not re.match(r"^[\S]{8,}$", password):
            return response_400('InvalidPassword',
                                'Password should have at least 8 characters and can contain any char except white space.')

        if not re.match(r'^[\S]{2,25}$', username):
            return response_400('InvalidUsername',
                                'Ussername should have at least 2 characters and maximum 25, it can contain any char except white space.')

        if not re.match(r'[a-zA-Z]{1,25}$', firstname):
            return response_400('InvalidFirstname',
                                'Firstname should have at least 1 character and maximum 25, it can contain any capital or small letter.')

        if not re.match(r'[a-zA-Z]{1,25}$', lastname):
            return response_400('InvalidLastname',
                                'Lastname should have at least 1 character and maximum 25, it can contain any capital or small letter.')

        if not email or not re.fullmatch(r'([\w\.\-]+)@([\w]+)\.([\w]+){2,}', email):
            return response_400('InvalidEmailFormat',
                                'Email should have an "@" sign and a email domain name with a domain ending of at least 2 characters.')

        db_instance = Database()
        db_instance.create_user(username, firstname, lastname, email, password)
        response = jsonify({})
        return response

    except IntegrityError as e:
        return response_400('UnavailableUsername', 'Username is unavailable.')

    except Exception as e:
        print(e)
        return response_500()


def login():
    """
        @api {POST} /api/v1/token/ User login
        @apiVersion 1.0.0

        @apiName PostToken
        @apiGroup Authentication

        @apiParam {String} username User's username.
        @apiParam {String} password User's password.

        @apiSuccess {String} token User's jwt.

        @apiSuccessExample {json} Success-Response:
        HTTP/1.1 200 OK
        {
            "token": "eyJ0eXA..."
        }

       @apiError (Unauthorized 401 ) {Object} InvalidLogin Username or password is incorrect.

        """

    try:
        # tries to get the value if none provided returns an emtpy string
        username = request.json.get('username', '')
        password = request.json.get('password', '')

        database_instance = Database()
        user = database_instance.verify_user(username, password)

        if not user:
            return response_401('username or password incorrect')

        token = jwt.encode({'id': user.id}, SECRET_KEY, algorithm='HS256')
        return jsonify({'token': token.decode('ascii')})

    except Exception as e:
        print(e)
        return response_500()
