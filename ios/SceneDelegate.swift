//
//  SceneDelegate.swift
//  tuzobus
//
//  Created by Pablo Hernán Muñoz García on 26/10/26.
//

import UIKit
import React
import React_RCTAppDelegate

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene else {
      return
    }

    guard
      let appDelegate = UIApplication.shared.delegate as? AppDelegate,
      let factory = appDelegate.reactNativeFactory
    else {
      fatalError("No se pudo obtener la fábrica de React Native")
    }

    let appWindow = UIWindow(windowScene: windowScene)
    window = appWindow
    appDelegate.window = appWindow

    factory.startReactNative(
      withModuleName: "MetroTransit",
      in: appWindow,
      launchOptions: appDelegate.reactNativeLaunchOptions
    )

    appWindow.makeKeyAndVisible()
  }
}


