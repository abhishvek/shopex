//Main providers
import 'package:provider/provider.dart';
import 'package:provider/single_child_widget.dart';
import 'package:shopex/core/providers/auth_provider.dart';

List<SingleChildWidget> providers = [...remoteProviders];

//Independent Providers
List<SingleChildWidget> remoteProviders = [
  ChangeNotifierProvider(create: (_) => AuthProvider())
];
