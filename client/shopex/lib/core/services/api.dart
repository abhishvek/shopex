import 'dart:convert';
import "package:http/http.dart" as http;
import 'package:shopex/app/shared/api_routes.dart';

class API {
  final http.Client httpClient = http.Client();

  //Signup
  Future signUp(Map body) async {
    final String path = "$API_URL/user/signup";
    final Uri uri = Uri.parse(path);

    http.Response response = await httpClient.post(uri,
        headers: {
          "Content-type": "application/json;charset=UTF-8",
          "Accept": "application/json"
        },
        body: jsonEncode(body));

    return response.body;
  }

  //Login
  Future login(Map body) async {
    final String path = "$API_URL/user/login";
    final Uri uri = Uri.parse(path);

    http.Response response = await httpClient.post(uri,
        headers: {
          "Content-type": "application/json;charset=UTF-8",
          "Accept": "application/json"
        },
        body: jsonEncode(body));

    return response.body;
  }
}
