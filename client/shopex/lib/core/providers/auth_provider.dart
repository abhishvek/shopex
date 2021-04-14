import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:shopex/core/services/api.dart';

class AuthProvider extends ChangeNotifier {
  final API _api = API();

  signup(Map body) async {
    try {
      _api.signUp(body).then((authData) {
        print(authData);
      });
    } catch (error) {
      //Add error widget
      print(error);
    }
  }

  login(Map body) async {
    try {
      _api.login(body).then((authData) async {
        Map<String, dynamic> parsedData = await json.decode(authData);
        print(parsedData['authentication']);
      });
    } catch (error) {
      //Add error widget
      print(error);
    }
  }
}
